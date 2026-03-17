const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    type: {
      type: String,
      enum: ['bug_fix', 'feature', 'documentation', 'code_review', 'issue_report', 'test', 'translation', 'design'],
      required: true
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, maxlength: 2000, default: '' },
    githubPrUrl: { type: String, trim: true, default: '' },
    githubIssueUrl: { type: String, trim: true, default: '' },
    points: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
    reviewNote: { type: String, maxlength: 500, default: '' },
    isManual: { type: Boolean, default: true },
    githubData: {
      prNumber: Number,
      prTitle: String,
      merged: Boolean,
      mergedAt: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

contributionSchema.index({ user: 1, status: 1 });
contributionSchema.index({ project: 1, status: 1 });
contributionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Contribution', contributionSchema);
