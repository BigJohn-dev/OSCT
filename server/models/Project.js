const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    githubUrl: { type: String, required: true, trim: true },
    websiteUrl: { type: String, trim: true, default: '' },
    language: { type: String, trim: true, default: 'Unknown' },
    topics: [{ type: String, trim: true }],
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate'
    },
    category: {
      type: String,
      enum: ['web', 'mobile', 'desktop', 'cli', 'library', 'framework', 'devtools', 'ai', 'blockchain', 'other'],
      default: 'other'
    },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    openIssues: { type: Number, default: 0 },
    logo: { type: String, default: '' },
    maintainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    contributionCount: { type: Number, default: 0 },
    lastGithubSync: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

projectSchema.index({ name: 'text', description: 'text', topics: 'text' });
projectSchema.index({ language: 1, difficulty: 1, category: 1 });
projectSchema.index({ isFeatured: -1, stars: -1 });

module.exports = mongoose.model('Project', projectSchema);
