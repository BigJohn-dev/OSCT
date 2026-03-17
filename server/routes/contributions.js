const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect, requireModerator } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validate');
const contributionController = require('../controllers/contributionController');

// @route   GET /api/contributions
router.get('/', asyncHandler(contributionController.getContributions));

// @route   GET /api/contributions/:id
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid contribution ID')],
  validate,
  asyncHandler(contributionController.getContributionById)
);

// @route   POST /api/contributions
router.post(
  '/',
  protect,
  [
    body('project').isMongoId().withMessage('Valid project ID required'),
    body('type').isIn(['bug_fix','feature','documentation','code_review','issue_report','test','translation','design']).withMessage('Invalid contribution type'),
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isLength({ max: 2000 }),
    body('githubPrUrl').optional().isURL(),
    body('githubIssueUrl').optional().isURL()
  ],
  validate,
  asyncHandler(contributionController.createContribution)
);

// @route   PUT /api/contributions/:id
router.put(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid contribution ID')],
  validate,
  asyncHandler(contributionController.updateContribution)
);

// @route   DELETE /api/contributions/:id
router.delete(
  '/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid contribution ID')],
  validate,
  asyncHandler(contributionController.deleteContribution)
);

// @route   PUT /api/contributions/:id/review
// @desc    Approve or reject a contribution (moderator+)
router.put(
  '/:id/review',
  protect,
  requireModerator,
  [
    param('id').isMongoId(),
    body('status').isIn(['approved','rejected']).withMessage('Status must be approved or rejected'),
    body('reviewNote').optional().isLength({ max: 500 })
  ],
  validate,
  asyncHandler(contributionController.reviewContribution)
);

module.exports = router;
