const mongoose = require('mongoose');

// ── Sub-schemas ────────────────────────────────────────────────

const LocationSchema = new mongoose.Schema(
  {
    map: { type: String },
    zone: { type: String },
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
  },
  { _id: false }
);

const DeviceSchema = new mongoose.Schema(
  {
    platform: { type: String, enum: ['pc', 'console', 'mobile', 'web', 'unknown'], default: 'unknown' },
    os: { type: String },
    deviceId: { type: String },
    appVersion: { type: String },
    sdkVersion: { type: String },
  },
  { _id: false }
);

const PerformanceSchema = new mongoose.Schema(
  {
    fps: { type: Number },
    latencyMs: { type: Number },
    memoryMb: { type: Number },
  },
  { _id: false }
);

// ── Main Event Schema ──────────────────────────────────────────

const EventSchema = new mongoose.Schema(
  {
    // ── References ────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },

    sessionId: {
      type: String,
      required: [true, 'sessionId is required'],
      index: true,
    },

    // ── Event Classification ───────────────────────────────────
    eventType: {
      type: String,
      required: [true, 'eventType is required'],
      enum: [
        // Session lifecycle
        'session_start',
        'session_end',
        // Gameplay
        'match_start',
        'match_end',
        'level_start',
        'level_complete',
        'level_failed',
        // Player actions
        'kill',
        'death',
        'assist',
        'ability_used',
        'item_purchased',
        'item_used',
        // Progression
        'xp_gained',
        'level_up',
        'achievement_unlocked',
        'rank_change',
        // Economy
        'currency_earned',
        'currency_spent',
        'purchase',
        // Social
        'friend_added',
        'party_joined',
        'chat_message',
        // Engagement
        'tutorial_step',
        'quest_started',
        'quest_completed',
        // System
        'error',
        'crash',
        'custom',
      ],
      index: true,
    },

    game: {
      type: String,
      required: [true, 'game is required'],
      trim: true,
      index: true,
    },

    // ── Timing ────────────────────────────────────────────────
    clientTimestamp: {
      type: Date,
      required: [true, 'clientTimestamp is required'],
    },

    serverTimestamp: {
      type: Date,
      default: Date.now,
    },

    // ── Event Payload ─────────────────────────────────────────
    // Flexible properties for event-specific data
    properties: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // ── Context ───────────────────────────────────────────────
    location: {
      type: LocationSchema,
      default: null,
    },

    device: {
      type: DeviceSchema,
      default: {},
    },

    performance: {
      type: PerformanceSchema,
      default: null,
    },

    // ── Session Context ───────────────────────────────────────
    sessionDurationSeconds: {
      type: Number,
      default: null,
    },

    // ── Processing Status ─────────────────────────────────────
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    // Use time-series-friendly collection options for high-volume writes
    collection: 'events',
  }
);

// ── Compound Indexes ───────────────────────────────────────────
EventSchema.index({ userId: 1, eventType: 1 });
EventSchema.index({ userId: 1, createdAt: -1 });
EventSchema.index({ sessionId: 1, clientTimestamp: 1 });
EventSchema.index({ game: 1, eventType: 1, createdAt: -1 });
EventSchema.index({ serverTimestamp: -1 });

// ── TTL Index: auto-delete raw events after 90 days ───────────
// Uncomment in production to control storage costs:
// EventSchema.index({ serverTimestamp: 1 }, { expireAfterSeconds: 7776000 });

// ── Static method: Get event counts by type for a user ────────
EventSchema.statics.getEventSummaryForUser = async function (userId) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$eventType',
        count: { $sum: 1 },
        lastOccurred: { $max: '$serverTimestamp' },
      },
    },
    { $sort: { count: -1 } },
  ]);
};

module.exports = mongoose.model('Event', EventSchema);
