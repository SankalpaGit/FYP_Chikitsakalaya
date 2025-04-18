const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');
const Appointment = require('./Appointment');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Patient, key: 'id' },
    onDelete: 'CASCADE',
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: Appointment, key: 'id' },
    onDelete: 'SET NULL',
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('confirmation', 'reminder'),
    allowNull: false,
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

// Associations
Notification.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Notification.belongsTo(Appointment, { foreignKey: 'appointmentId', as: 'appointment' });

module.exports = Notification;