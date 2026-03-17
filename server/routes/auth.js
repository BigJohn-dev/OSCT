const express = require('express');
const passport = require('passport');
const router = express.Router();
const { protect, generateToken } = require('../middleware/auth');

// @route   GET /api/auth/github
// @desc    Initiate GitHub OAuth
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email', 'read:user', 'public_repo'] })
);

// @route   GET /api/auth/github/callback
// @desc    GitHub OAuth callback
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed` }),
  (req, res) => {
    const token = generateToken(req.user._id);
    // Redirect to client with token
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:3000'}/auth/callback?token=${token}`);
  }
);

// @route   GET /api/auth/me
// @desc    Get current authenticated user
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// @route   POST /api/auth/logout
// @desc    Logout (client should discard token)
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
