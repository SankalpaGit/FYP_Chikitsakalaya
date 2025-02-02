// odels/Medication.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PatientReport = require('./PatientReport');

const Medication = sequelize.define('Medication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  reportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: PatientReport,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'medications',
  timestamps: true,
});

module.exports = Medication;
