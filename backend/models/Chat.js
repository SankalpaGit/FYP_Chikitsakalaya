// models/chat.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  appointmentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: Appointment, key: 'id' },
    onDelete: 'CASCADE',
  },
  senderType: {
    type: DataTypes.ENUM('doctor', 'patient'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true, // Nullable for media messages
  },
  messageType: {
    type: DataTypes.ENUM('text', 'image', 'file'),
    allowNull: false,
    defaultValue: 'text',
  },
  mediaUrl: {
    type: DataTypes.STRING, // URL to stored media (e.g., S3, local storage)
    allowNull: true,
  },
}, {
  timestamps: true,
});



module.exports = Chat;