const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient'); 
const router = express.Router();

// Register Route (Registration API)
router.post('/register', async (req, res) => { 
  const { email, password, firstName, lastName } = req.body;
  try {
    // Check if email already exists
    const existingUser = await Patient.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await Patient.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isVerified: true, // Automatically mark user as verified (no email verification)
      isProfileComplete: false,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const patient = await Patient.findOne({ where: { email } });
    if (!patient) return res.status(400).json({ message: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ 
      message: 'Login successful', 
      token ,
      isProfileComplete : patient.isProfileComplete,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
