const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Patient = sequelize.define('Patient', {
  id: {
    type: DataTypes.UUID,  // Change from INTEGER to UUID
    defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true, // Set to null if using OAuth only
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: true, // Only populated if logged in via Google OAuth
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateOfBirth: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  profileImage: {
    type: DataTypes.STRING, // Store URL of the profile image
    allowNull: true,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true, // Will be null after verification
  },
  otpExpiration: {
    type: DataTypes.DATE,
    allowNull: true, // To handle OTP expiration
  },
   isProfileComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // New field to track profile completion
  },
}, {
  tableName: 'patients',
  timestamps: true, // Sequelize will automatically manage createdAt and updatedAt fields
});

module.exports = Patient;
