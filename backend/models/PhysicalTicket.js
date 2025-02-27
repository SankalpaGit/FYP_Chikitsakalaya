// models/physicalTicket.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');

const PhysicalTicket = sequelize.define('PhysicalTicket', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tokenNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  pdfLink: {
    type: DataTypes.STRING,
    allowNull: false, // Link to the generated PDF ticket
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

module.exports = PhysicalTicket;
