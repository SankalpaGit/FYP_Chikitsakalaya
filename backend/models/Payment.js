// models/payment.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./appointment');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'failed'),
    defaultValue: 'pending',
  },
  paymentMethod: {
    type: DataTypes.ENUM('credit_card', 'debit_card', 'upi', 'net_banking'),
    allowNull: false,
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

module.exports = Payment;
