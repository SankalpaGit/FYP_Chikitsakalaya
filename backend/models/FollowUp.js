const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Appointment = require('./Appointment'); // Assuming you have an Appointment model


const FollowUp = sequelize.define('FollowUp', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Appointment,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  requestDescription: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional description from patient
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true, // Doctor's response (e.g., rejection reason)
  },
  requestedDate: {
    type: DataTypes.DATEONLY,
    allowNull: false, // Proposed date for follow-up
  },
  requestedStartTime: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "10:00"
  },
  requestedEndTime: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., "10:30"
  },
  appointmentType: {
    type: DataTypes.ENUM('online', 'physical'),
    allowNull: false,
  },
  hospitalAffiliation: {
    type: DataTypes.STRING,
    allowNull: true, 
  },
}, {
  timestamps: true,
  tableName: 'FollowUps',
});



module.exports = FollowUp;