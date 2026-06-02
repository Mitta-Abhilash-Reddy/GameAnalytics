const { body, query } = require('express-validator');

// All valid event types (must match Event.js schema enum)
const VALID_EVENT_TYPES = [
  'session_start', 'session_end',
  'match_start', 'match_end',
  'level_start', 'level_complete', 'level_failed',
  'kill', 'death', 'assist', 'ability_used',
  'item_purchased', 'item_used',
  'xp_gained', 'level_up', 'achievement_unlocked', 'rank_change',
  'currency_earned', 'currency_spent', 'purchase',
  'friend_added', 'party_joined', 'chat_message',
  'tutorial_step', 'quest_started', 'quest_completed',
  'error', 'crash', 'custom',
];

const VALID_PLATFORMS = ['pc', 'console', 'mobile', 'web', 'unknown'];

// ── Single Event Validators ────────────────────────────────────
const eventValidators = [
  body('eventType')
    .notEmpty().withMessage('eventType is required')
    .isIn(VALID_EVENT_TYPES).withMessage(`eventType must be one of: ${VALID_EVENT_TYPES.join(', ')}`),

  body('sessionId')
    .notEmpty().withMessage('sessionId is required')
    .isString().withMessage('sessionId must be a string')
    .isLength({ min: 1, max: 100 }).withMessage('sessionId must be 1–100 characters'),

  body('game')
    .notEmpty().withMessage('game is required')
    .isString().withMessage('game must be a string')
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('game name must be 1–100 characters'),

  body('clientTimestamp')
    .notEmpty().withMessage('clientTimestamp is required')
    .isISO8601().withMessage('clientTimestamp must be a valid ISO 8601 date string'),

  body('properties')
    .optional()
    .isObject().withMessage('properties must be an object'),

  body('device.platform')
    .optional()
    .isIn(VALID_PLATFORMS).withMessage(`device.platform must be one of: ${VALID_PLATFORMS.join(', ')}`),

  body('device.os')
    .optional()
    .isString().isLength({ max: 50 }),

  body('device.appVersion')
    .optional()
    .isString().isLength({ max: 20 }),

  body('location.map')
    .optional()
    .isString().isLength({ max: 100 }),

  body('performance.fps')
    .optional()
    .isFloat({ min: 0, max: 500 }).withMessage('fps must be between 0 and 500'),

  body('performance.latencyMs')
    .optional()
    .isFloat({ min: 0 }).withMessage('latencyMs must be a positive number'),
];

// ── Batch Event Validators ─────────────────────────────────────
const batchEventValidators = [
  body('events')
    .isArray({ min: 1, max: 100 })
    .withMessage('events must be an array of 1–100 items'),

  body('events.*.eventType')
    .notEmpty().withMessage('Each event must have an eventType')
    .isIn(VALID_EVENT_TYPES).withMessage('Invalid eventType in batch'),

  body('events.*.sessionId')
    .notEmpty().withMessage('Each event must have a sessionId')
    .isString(),

  body('events.*.game')
    .notEmpty().withMessage('Each event must have a game')
    .isString().trim(),

  body('events.*.clientTimestamp')
    .notEmpty().withMessage('Each event must have a clientTimestamp')
    .isISO8601().withMessage('clientTimestamp must be ISO 8601'),

  body('events.*.properties')
    .optional()
    .isObject(),
];

// ── Query Validators (for GET /events) ────────────────────────
const eventQueryValidators = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer')
    .toInt(),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100')
    .toInt(),

  query('eventType')
    .optional()
    .isIn(VALID_EVENT_TYPES).withMessage('Invalid eventType filter'),

  query('game')
    .optional()
    .isString().trim(),

  query('from')
    .optional()
    .isISO8601().withMessage('from must be a valid ISO 8601 date'),

  query('to')
    .optional()
    .isISO8601().withMessage('to must be a valid ISO 8601 date'),
];

module.exports = {
  eventValidators,
  batchEventValidators,
  eventQueryValidators,
  VALID_EVENT_TYPES,
};
