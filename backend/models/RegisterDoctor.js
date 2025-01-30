// models/RegisterDoctor.js

// This model store the doctor registration before getting accepted (approved) by the admin

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path based on your project structure

// Define the RegisterDoctor model
const RegisterDoctor = sequelize.define('RegisterDoctor', {
  // First Name
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Last Name
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Email (Gmail)
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  // Password
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 555], // Minimum password length is 6
    },
  },
  // Licence Number
  licenceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [8, 30], // Length of license number should be between 8 and 30
    },
  },
  // Licence Document (file path stored in the database)
  licenceDocument: {
    type: DataTypes.STRING, // Store the file path of the uploaded document
    allowNull: false,
  },
  // Status to track if the doctor is approved or pending
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending', // Initially, the status will be pending
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

// Sync the model with the database (creates the table if it doesn't exist)
RegisterDoctor.sync();

module.exports = RegisterDoctor;