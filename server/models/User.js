const mongoose = require('mongoose');
const POINTS_CONFIG = require('../config/points');

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, unique: true, sparse: true },
    githubUsername: { type: String, trim: true },
    githubToken: { type: String, select: false },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    location: { type: String, maxlength: 100, default: '' },
    website: { type: String, maxlength: 200, default: '' },
    skills: [{ type: String, trim: true }],
    totalPoints: { type: Number, default: 0, min: 0 },
    redeemedPoints: { type: Number, default: 0, min: 0 },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
    isActive: { type: Boolean, default: true },
    badges: [
      {
        name: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now }
      }
    ],
    socialLinks: {
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual: available points
userSchema.virtual('availablePoints').get(function () {
  return this.totalPoints - this.redeemedPoints;
});

// Auto-assign badges when points change
userSchema.methods.checkAndAssignBadges = function () {
  const earnedBadgeNames = this.badges.map((b) => b.name);
  POINTS_CONFIG.badges.forEach((badge) => {
    if (this.totalPoints >= badge.threshold && !earnedBadgeNames.includes(badge.name)) {
      this.badges.push({ name: badge.name, icon: badge.icon });
    }
  });
};

// Index for leaderboard queries
userSchema.index({ totalPoints: -1 });
userSchema.index({ githubUsername: 1 });

module.exports = mongoose.model('User', userSchema);
