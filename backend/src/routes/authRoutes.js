const express = require('express');
const router = express.Router();
const { register, login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { registerValidators, loginValidators } = require('../middleware/validators');

// ── Public Routes ──────────────────────────────────────────────
router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);

// ── Protected Routes ───────────────────────────────────────────
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
