const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Doctor = require('./Doctor'); // Import Doctor model

const DoctorWallet = sequelize.define('DoctorWallet', {
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
    balance: {
        type: DataTypes.DECIMAL(10, 2), 
        allowNull: false,
        defaultValue: 0.00,
    },
    remainBalance: {
        type: DataTypes.DECIMAL(10, 2), // changes with each withdrawal
        allowNull: false,
        defaultValue: 0.00,
    },
}, {
    timestamps: true, // Add createdAt, updatedAt
});

module.exports = DoctorWallet;