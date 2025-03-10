const Stripe = require('stripe');
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const DoctorDetail = require('../models/DoctorDetail');
const { createMeetingLink } = require('./createMeetingLinkController');
const { sendInvoice } = require('./sendInvoiceController');


const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createPaymentIntent = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { appointmentId } = req.body;



        if (!appointmentId) {
            return res.status(400).json({ success: false, message: "appointmentId is required" });
        }
        console.log("Received appointmentId in backend:", appointmentId);

        const appointment = await Appointment.findOne({
            where: { id: appointmentId },
            include: [{
                model: Doctor,
                include: [{ model: DoctorDetail, as: "doctorDetails", attributes: ['consultationFee'] }]
            }]
        });

        if (!appointment) {
            console.error("Error: Appointment not found in database!");
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }



        const consultationFees = appointment?.Doctor?.doctorDetails?.map(d => d.consultationFee);
        console.log("All Consultation Fees:", consultationFees);

        const consultationFee = consultationFees?.[0] || 0; // Take the first one
        console.log("Selected Consultation Fee:", consultationFee);


        console.log("Doctor Details:", appointment.Doctor);
        console.log("DoctorDetail:", appointment.Doctor?.DoctorDetail);


        if (!consultationFee || isNaN(consultationFee)) {
            console.error("Error: Invalid consultation fee!", consultationFee);
            return res.status(400).json({ success: false, message: "Invalid consultation fee" });
        }


        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(consultationFee * 100), // Convert to cents
            currency: 'usd',
            metadata: { appointmentId }
        });

        await Payment.create({
            appointmentId,
            amount: consultationFee,
            paymentStatus: 'pending',
            paymentMethod: 'stripe'
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: consultationFee
        });
        console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update Payment Status After Success
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { appointmentId, paymentStatus } = req.body;

        const payment = await Payment.findOne({ where: { appointmentId } });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment record not found" });
        }

        payment.paymentStatus = paymentStatus;
        await payment.save();

        const appointment = await Appointment.findOne({ where: { id: appointmentId } });

        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found" });
        }
        
        // If the payment is marked as "paid", trigger invoice generation
        if (paymentStatus === 'paid') {
            const appointment = await Appointment.findOne({ where: { id: appointmentId } });

            if (!appointment || appointment.appointmentType !== 'physical') {
                return res.status(200).json({ success: true, message: "Payment updated. No ticket required." });
            }

            const ticket = await sendInvoice(appointment);

            return res.status(200).json({ success: true, message: "Payment updated. Ticket generated and sent.", ticket });
        }

        // If the payment is marked as "paid", trigger link generation
        if (paymentStatus === 'paid') {
            const appointment = await Appointment.findOne({ where: { id: appointmentId } });

            if (!appointment || appointment.appointmentType !== 'online') {
                return res.status(200).json({ success: true, message: "Payment updated. No link required." });
            }

            const meetingResponse = await createMeetingLink(appointmentId);

            return res.status(200).json({ success: true, message: "Payment updated. link generated and sent.", meetingResponse });
        }

        res.status(200).json({ success: true, message: "Payment status updated" });
    } catch (error) {
        console.error("Error updating payment status:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
