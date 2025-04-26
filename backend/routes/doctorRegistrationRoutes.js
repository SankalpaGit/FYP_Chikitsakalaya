// routes/doctorRegistrationRoutes.js

// Import required modules and aliases them as required
const express = require('express'); 
const router = express.Router();
const upload = require('../config/multer'); 
const RegisterDoctor = require('../models/RegisterDoctor'); 
const Doctor = require('../models/Doctor');
const hashPassword = require('../utils/hashPassword'); 
const generateToken = require('../utils/jwtToken');
const verifyToken = require('../middlewares/authMiddleware');  
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken'); 
const nodemailer = require('nodemailer'); 

// Nodemailer setup
const transporter = nodemailer.createTransport({ //creating the nodemailer transporter
  service: 'gmail',
  auth: {
    user: 'joshisankalpa2@gmail.com', 
    pass: 'pcee bzmf shst yjuh',  // app password
  },
});

// POST route to register doctor with file upload
router.post('/doctors/register', upload.single('licenceDocument'), upload.handleFileUploadError, async (req, res) => {
  try {
    const { firstName, lastName, email, password, licenceNumber } = req.body;
    const licenceDocument = req.file ? req.file.path : null;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !licenceNumber || !licenceDocument) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ error: 'Password must be between 6 and 20 characters' });
    }

    if (licenceNumber.length < 8 || licenceNumber.length > 30) {
      return res.status(400).json({ error: 'Licence number must be between 8 and 30 characters' });
    }

    // Check if the email or licence number already exists
    const existingDoctor = await RegisterDoctor.findOne({ where: { email } });
    if (existingDoctor) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const existingLicence = await RegisterDoctor.findOne({ where: { licenceNumber } });
    if (existingLicence) {
      return res.status(409).json({ error: 'Licence number already registered' });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Save doctor registration
    const newDoctor = await RegisterDoctor.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      licenceNumber,
      licenceDocument,
      status: 'pending',
    });

    // Send email to the doctor
    const mailOptions = {
      from: 'joshisankalpa2@gmail.com',
      to: email,
      subject: 'Registration Confirmation - Chikitsakalya',
      text: `Dear Mr/Ms. ${firstName} ${lastName},\n\nThank you for registering with Chikitsakalya. We have received your registration request and will review it. You will be informed of the acceptance or rejection shortly.\n\nBest regards,\nChikitsakalya Team`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    return res.status(201).json({ message: 'Registration submitted for approval', doctor: newDoctor });

  } catch (error) {
    console.error(error);

    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Email or licence number already registered' });
    }

    return res.status(500).json({ error: 'Error during registration' });
  }
});

// PUT route to approve a doctor (admin)
router.put('/doctor/approve/:id', verifyToken, async (req, res) => {
  try {
    const doctorRequest = await RegisterDoctor.findByPk(req.params.id);

    if (!doctorRequest) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    if (doctorRequest.status !== 'pending') {
      return res.status(400).json({ error: `Doctor is already ${doctorRequest.status}.` });
    }

    // Set doctor status to approved in RegisterDoctor model
    doctorRequest.status = 'approved';
    await doctorRequest.save();

    // Copy relevant data to Doctor model
    const newDoctor = await Doctor.create({
      email: doctorRequest.email,
      password: doctorRequest.password,
      licenseNumber: doctorRequest.licenceNumber,
      certificate: doctorRequest.licenceDocument,
      phoneNumber: doctorRequest.phoneNumber || null, // Check if phoneNumber exists, otherwise set null
      speciality: doctorRequest.speciality || null, // Check if speciality exists, otherwise set null
      experience: doctorRequest.experience || null, // Check if experience exists, otherwise set null
      hospitalAffiliation: doctorRequest.hospitalAffiliation || null, // Check if hospitalAffiliation exists, otherwise set null
      consultationFee: doctorRequest.consultationFee || null, // Check if consultationFee exists, otherwise set null
      address: doctorRequest.address || null, // Check if address exists, otherwise set null
      city: doctorRequest.city || null, // Check if city exists, otherwise set null
      state: doctorRequest.state || null, // Check if state exists, otherwise set null
      zipCode: doctorRequest.zipCode || null, // Check if zipCode exists, otherwise set null
      country: doctorRequest.country || null, // Check if country exists, otherwise set null
      isApproved: true, // Approved status
      firstName: doctorRequest.firstName,
      lastName: doctorRequest.lastName,
    });
    

    // Send approval email
    const mailOptions = {
      from: 'joshisankalpa2@gmail.com',
      to: doctorRequest.email,
      subject: 'Congratulations on Your Approval!',
      text: `Congratulations Mr/Ms ${doctorRequest.firstName} ${doctorRequest.lastName} for successfully getting registered in Chikitsakalya. We are looking forward to seeing your contribution as a doctor to the healthcare community.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Error sending email' });
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ message: 'Doctor approved successfully', doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error approving doctor' });
  }
});

// PUT route to reject a doctor (admin)
router.put('/doctor/reject/:id', verifyToken, async (req, res) => {
  try {
    const doctorRequest = await RegisterDoctor.findByPk(req.params.id);

    if (!doctorRequest) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    doctorRequest.status = 'rejected';

    const mailOptions = {
      from: 'joshisankalpa2@gmail.com',
      to: doctorRequest.email,
      subject: 'Rejection of the request',
      text: `We love your dedication Mr/Ms ${doctorRequest.firstName} ${doctorRequest.lastName} for registering in Chikitsakalya. But unfortunately, your request was rejected.`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    await doctorRequest.save();

    res.json({ message: 'Doctor rejected', doctor: doctorRequest });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error rejecting doctor' });
  }
});

// GET route to list all doctors (admin)
router.get('/doctors/all', async (req, res) => {
  try {
    const doctors = await RegisterDoctor.findAll();
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching doctors' });
  }
});

// POST route to login doctor
router.post('/doctor/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find doctor by email
    const doctor = await Doctor.findOne({ where: { email } });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid gmail or password' });
    }

    // If the password matches, generate JWT token
    const token = jwt.sign(
      { doctorId: doctor.id, email: doctor.email },
      process.env.JWT_SECRET, // Your secret key
      { expiresIn: '1h' } // Token expiration time (1 hour)
    );

    // Return the token in response
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
