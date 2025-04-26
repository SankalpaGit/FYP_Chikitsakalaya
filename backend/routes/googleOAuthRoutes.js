// routes/googleOAuthRoutes.js
const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware'); // Assuming you have this from previous step
const Patient = require('../models/Patient'); // Import Patient model

// Google OAuth routes
router.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:5173/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    // Redirect to root (/) with token
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

// Protected route to get user data
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const patient = await Patient.findByPk(req.user.id);
    if (!patient) return res.status(404).json({ message: 'User not found' });
    res.json({
      id: patient.id,
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      isAcceptingTerms: patient.isAcceptingTerms,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;