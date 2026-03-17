const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Skip GitHub strategy registration if credentials are missing (e.g. during local dev setup)
if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
  console.warn('⚠️  GitHub OAuth credentials missing. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your .env file.');
} else {

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL || 'http://localhost:5000'}/api/auth/github/callback`,
      scope: ['user:email', 'read:user', 'public_repo']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          // Update github token and profile data
          user.githubToken = accessToken;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.githubUsername = profile.username;
          await user.save();
          return done(null, user);
        }

        // Create new user
        const email = profile.emails?.[0]?.value || `${profile.username}@github.local`;

        user = await User.create({
          githubId: profile.id,
          githubUsername: profile.username,
          githubToken: accessToken,
          name: profile.displayName || profile.username,
          email,
          avatar: profile.photos?.[0]?.value || '',
          bio: profile._json?.bio || '',
          location: profile._json?.location || '',
          website: profile._json?.blog || ''
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

} // end if (credentials present)
