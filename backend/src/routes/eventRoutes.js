const express = require('express');
const router = express.Router();

const {
  ingestEvent,
  ingestBatch,
  getUserEvents,
  getEventStats,
} = require('../controllers/eventController');

const { protect } = require('../middleware/auth');
const {
  eventValidators,
  batchEventValidators,
  eventQueryValidators,
} = require('../middleware/eventValidators');

// All event routes require authentication
router.use(protect);

// ── Ingestion ──────────────────────────────────────────────────
router.post('/', eventValidators, ingestEvent);
router.post('/batch', batchEventValidators, ingestBatch);

// ── Query ──────────────────────────────────────────────────────
// /stats must come before /:id style routes to avoid conflict
router.get('/stats', getEventStats);
router.get('/', eventQueryValidators, getUserEvents);

module.exports = router;
