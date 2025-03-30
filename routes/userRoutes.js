const express = require('express');
const passport = require('passport');
const { registerUser, loginUser } = require('../controllers/userController');
const router = express.Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user using local authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Redirect to GitHub OAuth login
 *     responses:
 *       302:
 *         description: Redirects to GitHub for authentication
 */
router.get('/login', (req, res) => {
  res.redirect('/auth/github');
});

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: Initiate GitHub OAuth login
 *     responses:
 *       302:
 *         description: Redirects to GitHub for authentication
 */
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

/**
 * @swagger
 * /auth/github/callback:
 *   get:
 *     summary: GitHub OAuth callback endpoint
 *     responses:
 *       302:
 *         description: Redirects after successful GitHub authentication
 *       400:
 *         description: Authentication failed
 */
router.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.json({ message: 'GitHub login successful', user: req.user });
  }
);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logout the current user
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err); }
    req.session.destroy(error => {
      if (error) return next(error);
      res.status(200).json({ message: 'You have been logged out successfully' });
    });
  });
});

module.exports = router;
