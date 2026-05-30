const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/jwt');
const {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
} = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────────────────────────
const register = async (req, res) => {
  // 1. Validate inputs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }

  const { username, email, password, displayName } = req.body;

  try {
    // 2. Check for duplicates
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return sendError(res, 409, `An account with this ${field} already exists`);
    }

    // 3. Create user (password hashed via pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
      displayName: displayName || username,
    });

    // 4. Generate JWT
    const token = generateAccessToken(user._id, user.role);

    logger.info(`New user registered: ${user.email} (${user._id})`);

    return sendSuccess(
      res,
      201,
      'Account created successfully',
      {
        token,
        user: user.toPublicProfile(),
      }
    );
  } catch (error) {
    logger.error(`Register error: ${error.message}`);
    // Handle Mongoose duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return sendError(res, 409, `${field} is already taken`);
    }
    return sendError(res, 500, 'Registration failed. Please try again.');
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, errors.array());
  }

  const { email, password } = req.body;

  try {
    // 1. Find user and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // Generic message to prevent email enumeration
      return sendUnauthorized(res, 'Invalid email or password');
    }

    // 2. Check account status
    if (!user.isActive) {
      return sendUnauthorized(res, 'Account has been deactivated. Contact support.');
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid email or password');
    }

    // 4. Update login metadata
    user.lastLoginAt = new Date();
    user.loginCount += 1;
    await user.save({ validateBeforeSave: false });

    // 5. Generate JWT
    const token = generateAccessToken(user._id, user.role);

    logger.info(`User logged in: ${user.email} (${user._id})`);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: user.toPublicProfile(),
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    return sendError(res, 500, 'Login failed. Please try again.');
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/auth/me
// Protected route – returns current user profile
// ─────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return sendError(res, 404, 'User not found');
    return sendSuccess(res, 200, 'Profile fetched', user.toPublicProfile());
  } catch (error) {
    logger.error(`GetMe error: ${error.message}`);
    return sendError(res, 500, 'Could not fetch profile');
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/auth/logout
// Client-side only for now (stateless JWT)
// ─────────────────────────────────────────────────────────────
const logout = async (req, res) => {
  // With stateless JWT, logout is handled client-side by discarding the token.
  // When refresh tokens are implemented (Phase 5+), invalidate here.
  return sendSuccess(res, 200, 'Logged out successfully');
};

module.exports = { register, login, getMe, logout };
