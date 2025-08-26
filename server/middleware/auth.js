const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [
        {
          association: 'companies',
          attributes: ['id', 'domain']
        },
        {
          association: 'roles',
          attributes: ['id', 'name', 'display_name']
        }
      ]
    });

    if (!user || !user.enabled) {
      return res.status(401).json({ message: 'User not found or disabled' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (user && user.enabled) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // Admin users have all permissions
      const isAdmin = req.user.roles?.some(role => role.name === 'admin');
      if (isAdmin) {
        return next();
      }

      // Check if user has the specific permission
      const hasPermission = await checkUserPermission(req.user.id, permission);
      
      if (!hasPermission) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

const checkUserPermission = async (userId, permission) => {
  try {
    const { UserPermission, UserRole, RolePermission, Permission } = require('../models');
    
    // Check direct user permissions
    const directPermission = await UserPermission.findOne({
      where: { user_id: userId },
      include: [{
        model: Permission,
        where: { name: permission }
      }]
    });
    
    if (directPermission) return true;
    
    // Check role-based permissions
    const rolePermission = await UserRole.findOne({
      where: { user_id: userId },
      include: [{
        model: Role,
        include: [{
          model: Permission,
          where: { name: permission },
          through: { attributes: [] }
        }]
      }]
    });
    
    return !!rolePermission;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
};

module.exports = {
  auth,
  optionalAuth,
  checkPermission
};
