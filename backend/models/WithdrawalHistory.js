const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor'); // Import Doctor model
const Appointment = require('./Appointment'); // Import Appointment model

const WithdrawalHistory = sequelize.define('WithdrawalHistory', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Doctor, // Reference to Doctor model
            key: 'id',
        },
    },
    appointmentId: {
        type: DataTypes.UUID,
        allowNull: true, // Allow NULL for total withdrawals
        references: {
            model: Appointment,
            key: 'id',
        },
    },
    amountRequested: {
        type: DataTypes.DECIMAL(10, 2), // Amount before deduction
        allowNull: false,
    },
    deduction: {
        type: DataTypes.DECIMAL(10, 2), // 15% deduction
        allowNull: false,
    },
    amountReceived: {
        type: DataTypes.DECIMAL(10, 2), // Amount after deduction
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
    },
}, {
    timestamps: true, // Add createdAt, updatedAt
});

module.exports = WithdrawalHistory;