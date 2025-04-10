const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Prescription = require('./Prescription');

const PrescriptionMedicine = sequelize.define('PrescriptionMedicine', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    prescriptionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: Prescription, key: 'id' },
        onDelete: 'CASCADE',
    },
    medicineName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    dosage: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    frequency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    instruction:{
        type: DataTypes.STRING,
        allowNull : true,
    }
}, {
    timestamps: true,
})

module.exports = PrescriptionMedicine