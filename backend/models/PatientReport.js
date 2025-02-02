const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const PatientReport = sequelize.define('PatientReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {  // foreign key references from patient table
      model: Patient,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  reportFilePath: { // store the file path of report
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'patient_reports',
  timestamps: true,
});

module.exports = PatientReport;
