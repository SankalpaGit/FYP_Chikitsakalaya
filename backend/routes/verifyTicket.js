// backend/routes/verifyTicket.js
const express = require('express');
const router = express.Router();
const PhysicalTicket = require('../models/PhysicalTicket');

router.get('/verify-ticket', async (req, res) => {
  const { tokenNumber, appointmentId } = req.query;
  const ticket = await PhysicalTicket.findOne({
    where: { tokenNumber, appointmentId },
  });
  if (ticket) {
    res.json({ valid: true, message: 'Ticket is authentic' });
  } else {
    res.json({ valid: false, message: 'Invalid ticket' });
  }
});

module.exports = router;