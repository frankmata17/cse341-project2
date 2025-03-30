const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  // Local Strategy for username/password authentication
  passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'No user found with that email' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  }));

  // GitHub Strategy for OAuth authentication
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Look for an existing user based on the GitHub ID
        let user = await User.findOne({ githubId: profile.id });
        if (user) {
          return done(null, user);
        }
        // If not found, create a new user using GitHub profile info
        user = new User({
          githubId: profile.id,
          username: profile.username,
          email: (profile.emails && profile.emails[0] && profile.emails[0].value) || `${profile.username}@github.com`
        });
        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Serialize user for sessions
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
