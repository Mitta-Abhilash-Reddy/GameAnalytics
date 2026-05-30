const User = require('../models/User');
const { verifyToken, extractBearerToken } = require('../utils/jwt');
const { sendUnauthorized, sendForbidden } = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────
// protect – Verifies JWT and attaches user to req.user
// ─────────────────────────────────────────────────────────────
const protect = async (req, res, next) => {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return sendUnauthorized(res, 'No token provided. Please login.');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return sendUnauthorized(res, 'Invalid or expired token. Please login again.');
  }

  try {
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return sendUnauthorized(res, 'User account no longer exists.');
    }

    if (!user.isActive) {
      return sendUnauthorized(res, 'Account has been deactivated.');
    }

    // Check if password was changed after the token was issued
    if (user.passwordChangedAfter(decoded.iat)) {
      return sendUnauthorized(res, 'Password recently changed. Please login again.');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return sendUnauthorized(res, 'Authentication failed.');
  }
};

// ─────────────────────────────────────────────────────────────
// restrictTo – Role-based access control
// Usage: restrictTo('admin', 'analyst')
// ─────────────────────────────────────────────────────────────
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Not authenticated.');
    }
    if (!roles.includes(req.user.role)) {
      return sendForbidden(
        res,
        `Access denied. Required role: ${roles.join(' or ')}.`
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
