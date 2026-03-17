const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/validate');
const User = require('../models/User');
const Contribution = require('../models/Contribution');

// @route   GET /api/leaderboard
// @desc    Global leaderboard
router.get('/', asyncHandler(async (req, res) => {
  const { period = 'all', limit = 20, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  let matchStage = { status: 'approved' };
  if (period === 'month') {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    matchStage.createdAt = { $gte: startOfMonth };
  } else if (period === 'week') {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    matchStage.createdAt = { $gte: startOfWeek };
  }

  if (period !== 'all') {
    // For time-based periods, aggregate contributions
    const leaderboard = await Contribution.aggregate([
      { $match: matchStage },
      { $group: { _id: '$user', periodPoints: { $sum: '$points' }, contributions: { $sum: 1 } } },
      { $sort: { periodPoints: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: { _id: '$user._id', name: '$user.name', avatar: '$user.avatar', githubUsername: '$user.githubUsername', totalPoints: '$user.totalPoints' },
          periodPoints: 1,
          contributions: 1
        }
      }
    ]);
    return res.json({ leaderboard, period });
  }

  // All-time leaderboard from user totals
  const total = await User.countDocuments({ isActive: true });
  const users = await User.find({ isActive: true })
    .select('name avatar githubUsername totalPoints badges')
    .sort({ totalPoints: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  res.json({
    leaderboard: users.map((u, i) => ({ rank: skip + i + 1, user: u, periodPoints: u.totalPoints })),
    period,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit))
  });
}));

// @route   GET /api/leaderboard/stats
// @desc    Community-wide stats
router.get('/stats', asyncHandler(async (req, res) => {
  const [totalUsers, totalContributions, totalPoints] = await Promise.all([
    User.countDocuments({ isActive: true }),
    Contribution.countDocuments({ status: 'approved' }),
    Contribution.aggregate([{ $match: { status: 'approved' } }, { $group: { _id: null, total: { $sum: '$points' } } }])
  ]);

  res.json({
    totalUsers,
    totalContributions,
    totalPointsAwarded: totalPoints[0]?.total || 0
  });
}));

module.exports = router;
