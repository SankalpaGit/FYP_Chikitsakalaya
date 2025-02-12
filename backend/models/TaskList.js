// models/task.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Assuming your DB config file
const Doctor = require('./Doctor'); // Import the Doctor model

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('completed', 'ongoing', 'upcoming'),
    allowNull: false,
    defaultValue: 'upcoming',
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  doctorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'id',
    },
    onDelete: 'CASCADE', // Deletes tasks if the associated doctor is deleted
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields automatically
});

module.exports = Task;
