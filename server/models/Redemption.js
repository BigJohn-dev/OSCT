const mongoose = require('mongoose');

const redemptionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rewardName: { type: String, required: true },
    rewardType: { type: String, required: true },
    pointsCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'fulfilled', 'cancelled'],
      default: 'pending'
    },
    code: { type: String, default: '' },
    fulfilledAt: { type: Date },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Redemption', redemptionSchema);
