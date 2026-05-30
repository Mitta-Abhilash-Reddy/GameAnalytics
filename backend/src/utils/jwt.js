const jwt = require('jsonwebtoken');
const logger = require('./logger');

/**
 * Generate a signed JWT access token.
 */
const generateAccessToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * Verify and decode a JWT token.
 * Returns decoded payload or null on failure.
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    logger.warn(`JWT verification failed: ${err.message}`);
    return null;
  }
};

/**
 * Extract Bearer token from Authorization header.
 */
const extractBearerToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.split(' ')[1];
};

module.exports = { generateAccessToken, verifyToken, extractBearerToken };
