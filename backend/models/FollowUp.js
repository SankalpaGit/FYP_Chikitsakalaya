const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Appointment = require('./Appointment'); // Assuming you have an Appointment model


const FollowUp = sequelize.define('FollowUp', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Appointment,
      key: 'id',
    },
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
   followUPType: {
    type: DataTypes.ENUM('online', 'physical'),
    allowNull: false,
  },
  requestDescription: {
    type: DataTypes.TEXT,
    allowNull: true, // Optional description from patient
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false,
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true, // Doctor's response (e.g., rejection reason)
  },
}, {
  timestamps: true,
  tableName: 'FollowUps',
});



module.exports = FollowUp;