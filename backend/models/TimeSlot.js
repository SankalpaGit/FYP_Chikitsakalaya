// models/TimeSlot.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // sequelize instance configured
const Doctor = require('./Doctor'); // Doctor model is defined 

const TimeSlot = sequelize.define('TimeSlot', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Doctor,  // Foreign key references the Doctor model
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']],
        },
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    appointmentType: {
        type: DataTypes.ENUM('online', 'physical'),
        allowNull: false,
        defaultValue: 'physical',
    },
    //new added columns
    hospitalAffiliation: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true, // Optional: Adds createdAt and updatedAt timestamps
});


module.exports = TimeSlot;
