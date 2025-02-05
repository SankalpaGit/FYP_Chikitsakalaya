const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Patient = require('./Patient');

const Test = sequelize.define('Test', {
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
  testName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tests',
  timestamps: true,
});

module.exports = Test;
