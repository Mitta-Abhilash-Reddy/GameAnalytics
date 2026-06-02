const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema(
  {
    // ── References ─────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // ── Game Context ───────────────────────────────────────────
    game: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    // ── Timing ────────────────────────────────────────────────
    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    durationSeconds: {
      type: Number,
      default: null, // null until session_end received
    },

    // ── Device Context ─────────────────────────────────────────
    platform: {
      type: String,
      enum: ['pc', 'console', 'mobile', 'web', 'unknown'],
      default: 'unknown',
    },

    deviceInfo: {
      os: { type: String, default: null },
      appVersion: { type: String, default: null },
      deviceId: { type: String, default: null },
    },

    // ── Session Metrics ────────────────────────────────────────
    eventsCount: {
      type: Number,
      default: 0,
    },

    // Breakdown of event types in this session
    eventBreakdown: {
      type: Map,
      of: Number,
      default: {},
    },

    // ── Status ────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound Indexes ───────────────────────────────────────────
SessionSchema.index({ userId: 1, startTime: -1 });
SessionSchema.index({ userId: 1, game: 1 });
SessionSchema.index({ userId: 1, isActive: 1 });

// ── Static: Get session summary for a user ─────────────────────
SessionSchema.statics.getUserSessionSummary = async function (userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), isActive: false } },
    {
      $group: {
        _id: '$game',
        totalSessions: { $sum: 1 },
        totalDurationSeconds: { $sum: '$durationSeconds' },
        avgDurationSeconds: { $avg: '$durationSeconds' },
        lastPlayed: { $max: '$startTime' },
      },
    },
    { $sort: { totalSessions: -1 } },
  ]);
};

module.exports = mongoose.model('Session', SessionSchema);
