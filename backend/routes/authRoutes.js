const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Debug route to verify routing works
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route working!' });
});

// Register route (uses controller)
router.post('/register', registerUser);

// Login route (uses controller)
router.post('/login', loginUser);

module.exports = router;
