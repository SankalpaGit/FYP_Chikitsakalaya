const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor');
const Patient = require('./Patient');

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderType: {
    type: DataTypes.ENUM('doctor', 'patient'),
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverType: {
    type: DataTypes.ENUM('doctor', 'patient'),
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Chat;
