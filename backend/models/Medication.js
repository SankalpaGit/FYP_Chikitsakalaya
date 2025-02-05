const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Medication = sequelize.define('Medication', {
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
  medicationName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'medications',
  timestamps: true,
});

module.exports = Medication;
