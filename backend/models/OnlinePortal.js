// models/onlinePortal.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');

const OnlinePortal = sequelize.define('OnlinePortal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  meetingLink: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  meetingPassword: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Appointment, key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: true,
});

module.exports = OnlinePortal;
