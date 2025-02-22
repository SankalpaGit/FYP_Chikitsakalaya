// controllers/paymentController.js

const Stripe = require('stripe');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        const { appointmentId, amount } = req.body;

        // Validate if appointment exists
        const appointment = await Appointment.findByPk(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: { appointmentId }
        });

        // Save payment details in the database
        await Payment.create({
            appointmentId,
            amount,
            paymentStatus: 'pending',
            paymentMethod: 'stripe'
        });

        res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, message: "Server error, try again later" });
    }
};
