const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const PatientReport = sequelize.define('PatientReport', {
  id: {
    type: DataTypes.UUID,  // Change from INTEGER to UUID
    defaultValue: DataTypes.UUIDV4, // Generate UUID automatically
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.UUID,
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
