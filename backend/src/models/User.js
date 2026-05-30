const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Never return password by default
    },

    // ── Profile ───────────────────────────────────────────────
    displayName: {
      type: String,
      trim: true,
      maxlength: [50, 'Display name cannot exceed 50 characters'],
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    // ── Role & Status ─────────────────────────────────────────
    role: {
      type: String,
      enum: ['player', 'analyst', 'admin'],
      default: 'player',
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    // ── Gaming Profile ────────────────────────────────────────
    gameProfile: {
      gamesPlayed: { type: Number, default: 0 },
      totalPlaytimeMinutes: { type: Number, default: 0 },
      favoriteGame: { type: String, default: null },
      rank: {
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster'],
        default: 'Bronze',
      },
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
    },

    // ── Churn Prediction ──────────────────────────────────────
    churnRisk: {
      score: { type: Number, default: null, min: 0, max: 1 },
      label: {
        type: String,
        enum: ['low', 'medium', 'high', null],
        default: null,
      },
      predictedAt: { type: Date, default: null },
    },

    // ── Auth Metadata ─────────────────────────────────────────
    lastLoginAt: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    refreshToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ────────────────────────────────────────────────────
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'churnRisk.label': 1 });
UserSchema.index({ createdAt: -1 });

// ── Virtual: fullStats ─────────────────────────────────────────
UserSchema.virtual('avgSessionMinutes').get(function () {
  if (!this.gameProfile.gamesPlayed) return 0;
  return Math.round(this.gameProfile.totalPlaytimeMinutes / this.gameProfile.gamesPlayed);
});

// ── Pre-save: Hash password ────────────────────────────────────
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  if (!this.isNew) this.passwordChangedAt = Date.now();
  next();
});

// ── Pre-save: Set displayName default ─────────────────────────
UserSchema.pre('save', function (next) {
  if (!this.displayName) this.displayName = this.username;
  next();
});

// ── Instance method: Compare password ─────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: Check if password changed after JWT issue ─
UserSchema.methods.passwordChangedAfter = function (jwtIssuedAt) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return jwtIssuedAt < changedTimestamp;
  }
  return false;
};

// ── Instance method: Safe public profile ──────────────────────
UserSchema.methods.toPublicProfile = function () {
  return {
    id: this._id,
    username: this.username,
    displayName: this.displayName,
    email: this.email,
    role: this.role,
    avatarUrl: this.avatarUrl,
    gameProfile: this.gameProfile,
    churnRisk: this.churnRisk,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
