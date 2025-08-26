const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  res.json({ message: 'Accounts endpoint' });
});

module.exports = router;
