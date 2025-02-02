// models/Test.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const PatientReport = require('./PatientReport');

const Test = sequelize.define('Test', {
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
  testName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'tests',
  timestamps: true,
});

module.exports = Test;
