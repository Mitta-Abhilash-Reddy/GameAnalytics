const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const {
  handleSessionStart,
  handleSessionEnd,
  incrementSessionEventCount,
} = require('../services/sessionService');
const {
  sendSuccess,
  sendError,
  sendValidationError,
  sendNotFound,
} = require('../utils/response');
const logger = require('../utils/logger');

// ─────────────────────────────────────────────────────────────
// Helper: Build event document from request body
// userId is ALWAYS set from req.user — never from body
// ─────────────────────────────────────────────────────────────
const buildEventDoc = (body, userId) => ({
  userId,
  sessionId: body.sessionId,
  eventType: body.eventType,
  game: body.game?.trim(),
  clientTimestamp: new Date(body.clientTimestamp),
  serverTimestamp: new Date(),
  properties: body.properties || {},
  location: body.location || null,
  device: body.device || {},
  performance: body.performance || null,
});

// ─────────────────────────────────────────────────────────────
// Helper: Handle session lifecycle side effects
// ─────────────────────────────────────────────────────────────
const handleSessionLifecycle = async (userId, eventData) => {
  const { eventType } = eventData;

  if (eventType === 'session_start') {
    await handleSessionStart(userId, eventData);
  } else if (eventType === 'session_end') {
    await handleSessionEnd(userId, eventData);
  }

  // Always increment session event counter (non-blocking)
  incrementSessionEventCount(eventData.sessionId, eventType).catch(() => {});
};

// ─────────────────────────────────────────────────────────────
// POST /api/events
// Ingest a single telemetry event
// ─────────────────────────────────────────────────────────────
const ingestEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidationError(res, errors.array());

  try {
    const userId = req.user._id;
    const eventDoc = buildEventDoc(req.body, userId);
    const event = await Event.create(eventDoc);

    // Handle session lifecycle async (non-blocking for response)
    handleSessionLifecycle(userId, req.body).catch((err) =>
      logger.error(`Session lifecycle error: ${err.message}`)
    );

    logger.debug(`Event ingested: ${event.eventType} (user: ${userId})`);

    return sendSuccess(res, 201, 'Event recorded', {
      eventId: event._id,
      eventType: event.eventType,
      sessionId: event.sessionId,
    });
  } catch (error) {
    logger.error(`ingestEvent error: ${error.message}`);
    return sendError(res, 500, 'Failed to record event');
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/events/batch
// Ingest up to 100 events in one request
// ─────────────────────────────────────────────────────────────
const ingestBatch = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidationError(res, errors.array());

  const { events } = req.body;
  const userId = req.user._id;

  try {
    const eventDocs = events.map((e) => buildEventDoc(e, userId));

    // ordered: false = partial success allowed (bad docs don't block good ones)
    const result = await Event.insertMany(eventDocs, { ordered: false });

    // Handle session lifecycles for session_start / session_end events
    const lifecycleEvents = events.filter(
      (e) => e.eventType === 'session_start' || e.eventType === 'session_end'
    );
    for (const e of lifecycleEvents) {
      handleSessionLifecycle(userId, e).catch((err) =>
        logger.error(`Batch session lifecycle error: ${err.message}`)
      );
    }

    logger.debug(`Batch ingested: ${result.length}/${events.length} events (user: ${userId})`);

    return sendSuccess(res, 201, `${result.length} of ${events.length} events recorded`, {
      inserted: result.length,
      submitted: events.length,
      failed: events.length - result.length,
    });
  } catch (error) {
    // insertMany with ordered:false throws but still inserts valid docs
    if (error.name === 'BulkWriteError') {
      const inserted = error.result?.nInserted || 0;
      logger.warn(`Batch partial failure: ${inserted}/${events.length} inserted`);
      return sendSuccess(res, 207, `Partial batch: ${inserted}/${events.length} events recorded`, {
        inserted,
        submitted: events.length,
        failed: events.length - inserted,
        errors: error.writeErrors?.map((e) => ({
          index: e.index,
          message: e.errmsg,
        })),
      });
    }
    logger.error(`ingestBatch error: ${error.message}`);
    return sendError(res, 500, 'Batch ingestion failed');
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events
// Get paginated events for the authenticated user
// Query params: page, limit, eventType, game, from, to
// ─────────────────────────────────────────────────────────────
const getUserEvents = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return sendValidationError(res, errors.array());

  const userId = req.user._id;
  const {
    page = 1,
    limit = 20,
    eventType,
    game,
    from,
    to,
  } = req.query;

  try {
    // Build dynamic filter
    const filter = { userId };
    if (eventType) filter.eventType = eventType;
    if (game) filter.game = { $regex: game, $options: 'i' };
    if (from || to) {
      filter.serverTimestamp = {};
      if (from) filter.serverTimestamp.$gte = new Date(from);
      if (to) filter.serverTimestamp.$lte = new Date(to);
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ serverTimestamp: -1 })
        .skip(skip)
        .limit(limit)
        .select('-__v'),
      Event.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);

    return sendSuccess(
      res,
      200,
      'Events fetched',
      { events },
      {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    );
  } catch (error) {
    logger.error(`getUserEvents error: ${error.message}`);
    return sendError(res, 500, 'Failed to fetch events');
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/events/stats
// Aggregate event statistics for the authenticated user
// ─────────────────────────────────────────────────────────────
const getEventStats = async (req, res) => {
  const userId = req.user._id;

  try {
    const [eventTypeCounts, gameCounts, dailyActivity, totals] = await Promise.all([

      // Events grouped by type
      Event.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$eventType', count: { $sum: 1 }, lastOccurred: { $max: '$serverTimestamp' } } },
        { $sort: { count: -1 } },
      ]),

      // Events grouped by game
      Event.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: '$game', count: { $sum: 1 }, lastPlayed: { $max: '$serverTimestamp' } } },
        { $sort: { count: -1 } },
      ]),

      // Daily event counts for last 30 days
      Event.aggregate([
        {
          $match: {
            userId: new mongoose.Types.ObjectId(userId),
            serverTimestamp: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$serverTimestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Totals
      Event.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: null,
            totalEvents: { $sum: 1 },
            uniqueGames: { $addToSet: '$game' },
            uniqueSessions: { $addToSet: '$sessionId' },
            firstEvent: { $min: '$serverTimestamp' },
            lastEvent: { $max: '$serverTimestamp' },
          },
        },
      ]),
    ]);

    const summary = totals[0] || {
      totalEvents: 0,
      uniqueGames: [],
      uniqueSessions: [],
      firstEvent: null,
      lastEvent: null,
    };

    return sendSuccess(res, 200, 'Event stats fetched', {
      summary: {
        totalEvents: summary.totalEvents,
        uniqueGames: summary.uniqueGames.length,
        uniqueSessions: summary.uniqueSessions.length,
        firstEvent: summary.firstEvent,
        lastEvent: summary.lastEvent,
      },
      byEventType: eventTypeCounts.map((e) => ({
        eventType: e._id,
        count: e.count,
        lastOccurred: e.lastOccurred,
      })),
      byGame: gameCounts.map((g) => ({
        game: g._id,
        count: g.count,
        lastPlayed: g.lastPlayed,
      })),
      dailyActivity: dailyActivity.map((d) => ({
        date: d._id,
        count: d.count,
      })),
    });
  } catch (error) {
    logger.error(`getEventStats error: ${error.message}`);
    return sendError(res, 500, 'Failed to fetch event stats');
  }
};

module.exports = { ingestEvent, ingestBatch, getUserEvents, getEventStats };
