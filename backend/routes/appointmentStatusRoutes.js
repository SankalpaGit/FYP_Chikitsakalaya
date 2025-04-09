const express = require('express');
const Appointment = require('../models/Appointment');

const Router = express.Router();

// Mark appointment as complete
Router.post('/appointment/complete', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.isComplete = true;
    await appointment.save();

    return res.status(200).json({ message: 'Appointment marked as complete', appointment });
  } catch (error) {
    return res.status(500).json({ message: 'Error completing appointment', error: error.message });
  }
});

// Cancel appointment
Router.post('/appointment/cancel', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.isCancelled = true;
    await appointment.save();

    return res.status(200).json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    return res.status(500).json({ message: 'Error cancelling appointment', error: error.message });
  }
});

// Delete appointment
Router.delete('/appointment/delete', async (req, res) => {
  const { appointmentId } = req.body;

  try {
    const appointment = await Appointment.findByPk(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    await appointment.destroy();

    return res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
});

module.exports = Router;
