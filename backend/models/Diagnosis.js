// models/Diagnosis.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PatientReport = require('./PatientReport');

const Diagnosis = sequelize.define('Diagnosis', {
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
  diagnosisName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'diagnoses',
  timestamps: true,
});

module.exports = Diagnosis;
