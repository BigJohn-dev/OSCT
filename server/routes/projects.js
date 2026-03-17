const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const { protect, requireAdmin, requireModerator } = require('../middleware/auth');
const { validate, asyncHandler } = require('../middleware/validate');
const projectController = require('../controllers/projectController');

// @route   GET /api/projects
// @desc    Get all projects (filtered, paginated)
router.get('/', asyncHandler(projectController.getProjects));

// @route   GET /api/projects/featured
// @desc    Get featured projects
router.get('/featured', asyncHandler(projectController.getFeaturedProjects));

// @route   GET /api/projects/:id
// @desc    Get project by ID
router.get(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid project ID')],
  validate,
  asyncHandler(projectController.getProjectById)
);

// @route   POST /api/projects
// @desc    Create a new project
router.post(
  '/',
  protect,
  requireModerator,
  [
    body('name').trim().notEmpty().withMessage('Project name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('githubUrl').isURL().withMessage('Valid GitHub URL is required'),
    body('difficulty').optional().isIn(['beginner', 'intermediate', 'advanced']),
    body('category').optional().isIn(['web', 'mobile', 'desktop', 'cli', 'library', 'framework', 'devtools', 'ai', 'blockchain', 'other'])
  ],
  validate,
  asyncHandler(projectController.createProject)
);

// @route   PUT /api/projects/:id
// @desc    Update project
router.put(
  '/:id',
  protect,
  requireModerator,
  [param('id').isMongoId().withMessage('Invalid project ID')],
  validate,
  asyncHandler(projectController.updateProject)
);

// @route   DELETE /api/projects/:id
// @desc    Delete project
router.delete(
  '/:id',
  protect,
  requireAdmin,
  [param('id').isMongoId().withMessage('Invalid project ID')],
  validate,
  asyncHandler(projectController.deleteProject)
);

// @route   POST /api/projects/:id/sync
// @desc    Sync project data from GitHub
router.post(
  '/:id/sync',
  protect,
  requireModerator,
  asyncHandler(projectController.syncFromGithub)
);

module.exports = router;
