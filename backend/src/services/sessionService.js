const Session = require('../models/Session');
const logger = require('../utils/logger');

/**
 * Creates a new session when a session_start event is received.
 * If a session with the same sessionId already exists, returns it (idempotent).
 */
const handleSessionStart = async (userId, eventData) => {
  const { sessionId, game, clientTimestamp, device = {} } = eventData;

  try {
    // Idempotent: don't duplicate if client retries
    const existing = await Session.findOne({ sessionId });
    if (existing) return existing;

    const session = await Session.create({
      userId,
      sessionId,
      game,
      startTime: new Date(clientTimestamp),
      platform: device.platform || 'unknown',
      deviceInfo: {
        os: device.os || null,
        appVersion: device.appVersion || null,
        deviceId: device.deviceId || null,
      },
      isActive: true,
    });

    logger.debug(`Session started: ${sessionId} (user: ${userId})`);
    return session;
  } catch (error) {
    // Non-fatal: session tracking failure shouldn't block event ingestion
    logger.error(`handleSessionStart error: ${error.message}`);
    return null;
  }
};

/**
 * Closes a session when a session_end event is received.
 * Calculates duration and marks session as inactive.
 */
const handleSessionEnd = async (userId, eventData) => {
  const { sessionId, clientTimestamp } = eventData;

  try {
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      logger.warn(`session_end received for unknown session: ${sessionId}`);
      return null;
    }

    if (!session.isActive) {
      // Already closed, idempotent
      return session;
    }

    const endTime = new Date(clientTimestamp);
    const durationSeconds = Math.max(
      0,
      Math.round((endTime - session.startTime) / 1000)
    );

    session.endTime = endTime;
    session.durationSeconds = durationSeconds;
    session.isActive = false;
    await session.save();

    logger.debug(`Session ended: ${sessionId}, duration: ${durationSeconds}s`);
    return session;
  } catch (error) {
    logger.error(`handleSessionEnd error: ${error.message}`);
    return null;
  }
};

/**
 * Increments the event count on an active session.
 * Also tracks event type breakdown for analytics.
 */
const incrementSessionEventCount = async (sessionId, eventType) => {
  try {
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $inc: {
          eventsCount: 1,
          [`eventBreakdown.${eventType}`]: 1,
        },
      }
    );
  } catch (error) {
    // Non-fatal
    logger.error(`incrementSessionEventCount error: ${error.message}`);
  }
};

module.exports = {
  handleSessionStart,
  handleSessionEnd,
  incrementSessionEventCount,
};
