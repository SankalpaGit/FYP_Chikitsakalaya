const express = require("express");
const { Chat, Appointment, Patient, Doctor } = require("../models");
const router = express.Router();

// **Get list of chats for a user (Doctor or Patient)**
router.get("/chats", async (req, res) => {
  try {
    const { userId, userType } = req.query;  // userId is either patient or doctor ID

    let chats;
    if (userType === "patient") {
      // Get list of appointments and the corresponding doctors for the patient
      chats = await Appointment.findAll({
        where: { patientId: userId },
        include: [{ model: Doctor }],
      });
    } else if (userType === "doctor") {
      // Get list of appointments and the corresponding patients for the doctor
      chats = await Appointment.findAll({
        where: { doctorId: userId },
        include: [{ model: Patient }],
      });
    }

    const chatList = chats.map((appointment) => {
      return {
        id: appointment.id,
        name: userType === "patient" ? appointment.Doctor.firstName + " " + appointment.Doctor.lastName : appointment.Patient.firstName + " " + appointment.Patient.lastName,
        userId: userType === "patient" ? appointment.Doctor.id : appointment.Patient.id,
        userType: userType === "patient" ? "doctor" : "patient",
      };
    });

    res.json(chatList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch chat list." });
  }
});

// **Send a message**
router.post("/send", async (req, res) => {
  try {
    const { senderId, recipientId, message, senderType, recipientType, appointmentId } = req.body;

    // Ensure the sender and recipient have an active appointment
    const appointment = await Appointment.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      return res.status(400).json({ error: "No active appointment found." });
    }

    const chat = await Chat.create({
      senderId,
      recipientId,
      message,
      senderType,
      recipientType,
      appointmentId,
    });

    // Emit the message to the corresponding socket
    io.to(recipientId).emit("receive-message", {
      senderId,
      recipientId,
      message,
    });

    res.status(201).json({ chat });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message." });
  }
});

module.exports = router;
