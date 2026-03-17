const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { protect, requireAdmin } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validate');
const userController = require('../controllers/userController');

// @route   GET /api/users
// @desc    Get all users (paginated)
router.get('/', asyncHandler(userController.getUsers));

// @route   GET /api/users/:id
// @desc    Get user by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  asyncHandler(userController.getUserById)
);

// @route   POST /api/users
// @desc    Create a new user (admin only)
router.post(
  '/',
  protect,
  requireAdmin,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required')
  ],
  validate,
  asyncHandler(userController.createUser)
);

// @route   PUT /api/users/:id
// @desc    Update user profile
router.put(
  '/:id',
  protect,
  [
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('name').optional().trim().notEmpty(),
    body('bio').optional().isLength({ max: 500 }),
    body('skills').optional().isArray()
  ],
  validate,
  asyncHandler(userController.updateUser)
);

// @route   DELETE /api/users/:id
// @desc    Delete user (admin only)
router.delete(
  '/:id',
  protect,
  requireAdmin,
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  asyncHandler(userController.deleteUser)
);

// @route   GET /api/users/:id/contributions
// @desc    Get user's contributions
router.get(
  '/:id/contributions',
  [param('id').isMongoId().withMessage('Invalid user ID')],
  validate,
  asyncHandler(userController.getUserContributions)
);

module.exports = router;
