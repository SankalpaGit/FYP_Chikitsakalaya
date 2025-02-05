const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Diagnosis = sequelize.define('Diagnosis', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: { // 🔄 Changed from reportId to patientId
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
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
