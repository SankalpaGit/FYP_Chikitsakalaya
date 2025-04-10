// models/Prescription.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Appointment = require('./Appointment');

const Prescription = sequelize.define('Prescription', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    appointmentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model : Appointment , key: 'id' },
        onDelete: 'CASCADE',
    },
    diagnosis: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    timestamps: true,
});

module.exports = Prescription;