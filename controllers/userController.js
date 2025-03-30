const User = require('../models/user');
const passport = require('passport');

// Register a new user
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error registering user' });
  }
};

// Login user using Passport Local Strategy
exports.loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json({ error: info.message || 'Invalid credentials' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Return minimal user info (avoid sending sensitive data)
      return res.json({ message: 'Login successful', user: { id: user._id, email: user.email } });
    });
  })(req, res, next);
};
