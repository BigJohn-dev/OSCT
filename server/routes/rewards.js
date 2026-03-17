const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, requireAdmin } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validate');
const POINTS_CONFIG = require('../config/points');
const Redemption = require('../models/Redemption');
const User = require('../models/User');

// @route   GET /api/rewards
// @desc    List all available rewards
router.get('/', (req, res) => {
  res.json({ rewards: POINTS_CONFIG.rewards });
});

// @route   POST /api/rewards/redeem
// @desc    Redeem points for a reward
router.post(
  '/redeem',
  protect,
  [body('rewardName').trim().notEmpty().withMessage('Reward name is required')],
  validate,
  asyncHandler(async (req, res) => {
    const { rewardName } = req.body;
    const reward = POINTS_CONFIG.rewards.find(r => r.name === rewardName);

    if (!reward) return res.status(404).json({ error: 'Reward not found' });

    const user = await User.findById(req.user._id);
    const available = user.totalPoints - user.redeemedPoints;

    if (available < reward.cost) {
      return res.status(400).json({
        error: `Insufficient points. You need ${reward.cost} but have ${available} available.`
      });
    }

    user.redeemedPoints += reward.cost;
    await user.save();

    const redemption = await Redemption.create({
      user: user._id,
      rewardName: reward.name,
      rewardType: reward.type,
      pointsCost: reward.cost
    });

    res.status(201).json({ message: 'Reward redeemed successfully!', redemption, availablePoints: user.totalPoints - user.redeemedPoints });
  })
);

// @route   GET /api/rewards/my-redemptions
// @desc    Get current user's redemption history
router.get('/my-redemptions', protect, asyncHandler(async (req, res) => {
  const redemptions = await Redemption.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ redemptions });
}));

// @route   GET /api/rewards/all-redemptions (admin)
router.get('/all-redemptions', protect, requireAdmin, asyncHandler(async (req, res) => {
  const redemptions = await Redemption.find()
    .populate('user', 'name email avatar')
    .sort({ createdAt: -1 });
  res.json({ redemptions });
}));

// @route   PUT /api/rewards/redemptions/:id/fulfill
router.put(
  '/redemptions/:id/fulfill',
  protect,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const redemption = await Redemption.findByIdAndUpdate(
      req.params.id,
      { status: 'fulfilled', fulfilledAt: new Date(), code: req.body.code || '', notes: req.body.notes || '' },
      { new: true }
    );
    if (!redemption) return res.status(404).json({ error: 'Redemption not found' });
    res.json({ redemption });
  })
);

module.exports = router;
