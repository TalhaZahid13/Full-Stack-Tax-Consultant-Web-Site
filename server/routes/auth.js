const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Company, UserCompany, Role } = require('../models');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

// ==========================
// Register User
// ==========================
router.post('/register', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('company_name').notEmpty().withMessage('Company name is required'),
  body('role').notEmpty().withMessage('Role is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, company_name, role } = req.body;

    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create company
    const company = await Company.create({
      domain: company_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      enabled: true
    });

    // Create user
    user = await User.create({
      name,
      email,
      password,
      enabled: true,
      locale: 'en-GB',
      created_from: 'web'
    });

    // Associate user with company
    await UserCompany.create({
      user_id: user.id,
      company_id: company.id
    });

    // Assign role
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (roleRecord) await user.setRoles([roleRecord.id]);

    // Generate token
    const token = generateToken(user.id);

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // Fetch user with roles
    const registeredUser = await User.findByPk(user.id, {
      include: [{ association: 'roles', attributes: ['id', 'name'] }]
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: registeredUser.id,
        name: registeredUser.name,
        email: registeredUser.email,
        locale: registeredUser.locale,
        roles: registeredUser.roles.map(r => r.name.toLowerCase())
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Login User
// ==========================
router.post('/login', [
  body('email').isEmail().withMessage('Please include a valid email'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [{ association: 'roles', attributes: ['id', 'name'] }] // fetch roles
    });

    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    if (!user.enabled) return res.status(400).json({ message: 'Account is disabled' });

    const isMatch = await user.checkPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    await user.update({ last_logged_in_at: new Date() });

    const token = generateToken(user.id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const roles = user.roles.map(r => r.name.toLowerCase());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        locale: user.locale,
        last_logged_in_at: user.last_logged_in_at,
        roles
      },
      redirectTo: roles.includes('user') ? '/user-dashboard' : '/admin-dashboard'
    });

    console.log("Login successful for user:", user.email, "Roles:", roles);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Logout
// ==========================
router.post('/logout', auth, async (req, res) => {
  try {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Get current user
// ==========================
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { association: 'companies', attributes: ['id', 'domain', 'enabled'] },
        { association: 'roles', attributes: ['id', 'name', 'display_name'] }
      ]
    });

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        locale: user.locale,
        landing_page: user.landing_page,
        last_logged_in_at: user.last_logged_in_at,
        companies: user.companies,
        roles: user.roles.map(r => r.name.toLowerCase())
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Update Profile
// ==========================
router.put('/profile', [
  auth,
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Please include a valid email'),
  body('locale').optional().isLength({ min: 2, max: 5 }).withMessage('Invalid locale')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, locale, landing_page } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (locale) updateData.locale = locale;
    if (landing_page) updateData.landing_page = landing_page;

    // Check if email is taken
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) return res.status(400).json({ message: 'Email already in use' });
    }

    await req.user.update(updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        locale: req.user.locale,
        landing_page: req.user.landing_page
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==========================
// Change Password
// ==========================
router.put('/password', [
  auth,
  body('current_password').exists().withMessage('Current password is required'),
  body('new_password').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { current_password, new_password } = req.body;

    const isMatch = await req.user.checkPassword(current_password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    await req.user.update({ password: new_password });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
