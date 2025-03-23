const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Appointment = require("../models/Appointment");

const Chat = sequelize.define(
  "Chat",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Appointments",
        key: "id",
      },
    },
    senderType: {
      type: DataTypes.ENUM("doctor", "patient"),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);


module.exports = Chat;
