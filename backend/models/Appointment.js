// models/appointment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');
const Patient = require('./Patient');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  StartTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  EndTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  appointmentType: {
    type: DataTypes.ENUM('online', 'physical'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Doctor, key: 'id' },
    onDelete: 'CASCADE',
  },
  patientId: {
    type: DataTypes.UUID, 
    allowNull: false,
    references: { model: Patient, key: 'id' },
    onDelete: 'CASCADE',
  },
  hospitalAffiliation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isCancelled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },  
}, {
  timestamps: true,
});

module.exports = Appointment;