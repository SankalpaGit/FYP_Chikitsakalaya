const express = require('express');
const { createPaymentIntent, updatePaymentStatus } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);
router.post('/update-status', updatePaymentStatus);

module.exports = router;
