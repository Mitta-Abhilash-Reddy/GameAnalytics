/**
 * Standardized API response format for GamePulse AI.
 * All responses follow: { success, message, data?, error?, meta? }
 */

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = null) => {
  const response = { success: true, message };
  if (data !== null) response.data = data;
  if (meta !== null) response.meta = meta;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = { success: false, message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

const sendValidationError = (res, errors) => {
  return sendError(res, 422, 'Validation failed', errors);
};

const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, 401, message);
};

const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, 403, message);
};

const sendNotFound = (res, resource = 'Resource') => {
  return sendError(res, 404, `${resource} not found`);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
};
