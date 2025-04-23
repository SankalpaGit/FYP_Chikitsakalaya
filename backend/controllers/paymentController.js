const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Appointment, Payment, Notification, Doctor, DoctorDetail, TimeSlot, Patient, sequelize } = require('../models');
const { Op } = require('sequelize');
const { createMeetingLink } = require('./createMeetingLinkController'); // Import the createMeetingLink function

const createPaymentIntent = async (req, res) => {
    try {
        const {
            doctorId,
            patientId,
            date,
            StartTime,
            EndTime,
            appointmentType,
            description,
            hospitalAffiliation,
            consultationFee,
        } = req.body;

        if (!doctorId || !patientId || !consultationFee) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields for payment intent.',
            });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(consultationFee * 100),
            currency: 'usd',
            metadata: {
                doctorId,
                patientId,
                date,
                StartTime,
                EndTime,
                appointmentType,
                description,
                hospitalAffiliation: hospitalAffiliation || '',
                consultationFee: consultationFee.toString(),
            },
        });

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: consultationFee,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not create payment intent.',
            error: error.message,
        });
    }
};

const updatePaymentStatus = async (req, res) => {
    const { paymentIntentId, paymentStatus } = req.body;

    if (!paymentIntentId || !paymentStatus) {
        return res.status(400).json({
            success: false,
            message: 'Payment intent ID and status are required.',
        });
    }

    const transaction = await sequelize.transaction();

    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        // console.log('PaymentIntent retrieved:', paymentIntent);

        if (paymentIntent.status !== 'succeeded') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Payment has not been successfully completed.',
            });
        }

        const {
            doctorId,
            patientId,
            date,
            StartTime,
            EndTime,
            appointmentType,
            description,
            hospitalAffiliation,
            consultationFee,
        } = paymentIntent.metadata;

        console.log('PaymentIntent metadata:', paymentIntent.metadata);

        // Validate required metadata
        if (!doctorId || !patientId || !date || !StartTime || !EndTime || !appointmentType || !consultationFee) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Incomplete appointment data in payment intent metadata.',
            });
        }

        // Verify Doctor and DoctorDetail
        const doctor = await Doctor.findByPk(doctorId, {
            include: [{
                model: DoctorDetail,
                as: 'doctorDetails',
                attributes: ['consultationFee'],
                where: { consultationFee: { [Op.ne]: null } },
                required: false,
            }],
        });

        if (!doctor) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Doctor not found.',
            });
        }

        if (!doctor.doctorDetails || doctor.doctorDetails.length === 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Doctor profile incomplete: No valid details available.',
            });
        }

        const metadataConsultationFee = parseFloat(consultationFee);
        if (isNaN(metadataConsultationFee) || metadataConsultationFee <= 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Invalid consultation fee in metadata.',
            });
        }

        // Verify TimeSlot
        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const timeSlot = await TimeSlot.findOne({
            where: {
                doctorId,
                day: dayOfWeek,
                startTime: StartTime,
                endTime: EndTime,
                appointmentType,
                hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
            },
        });

        if (!timeSlot) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Selected time slot is no longer available.',
            });
        }

        // Check for conflicting appointments
        const existingAppointment = await Appointment.findOne({
            where: {
                doctorId,
                date,
                [Op.or]: [
                    {
                        [Op.and]: [
                            { StartTime: { [Op.lte]: EndTime } },
                            { EndTime: { [Op.gte]: StartTime } },
                        ],
                    },
                ],
            },
        });

        if (existingAppointment) {
            await transaction.rollback();
            return res.status(409).json({
                success: false,
                message: 'Time slot already booked.',
            });
        }

        // Create Appointment
        const appointment = await Appointment.create({
            doctorId,
            patientId,
            date,
            StartTime,
            EndTime,
            appointmentType,
            description,
            hospitalAffiliation: appointmentType === 'physical' ? hospitalAffiliation : null,
        }, { transaction });

        console.log('Created Appointment:', appointment.toJSON());

        // Create Meeting Link for Online Appointments
        if (appointmentType === 'online') {
            try {
                const meetingResult = await createMeetingLink(appointment, transaction);
                if (!meetingResult.success) {
                    console.error('Meeting link creation failed:', meetingResult.message);
                    await transaction.rollback();
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to create meeting link.',
                        error: meetingResult.message,
                    });
                }
                console.log('Created Meeting Link:', meetingResult.meeting.toJSON());
            } catch (meetingError) {
                console.error('Meeting link creation error:', meetingError);
                await transaction.rollback();
                return res.status(500).json({
                    success: false,
                    message: 'Server error: Could not create meeting link.',
                    error: meetingError.message,
                });
            }
        }

        // Create Payment
        try {
            const payment = await Payment.create({
                appointmentId: appointment.id,
                amount: metadataConsultationFee,
                paymentStatus,
                paymentMethod: 'stripe',
                paymentIntentId,
            }, { transaction });

            console.log('Created Payment:', payment.toJSON());
        } catch (paymentError) {
            console.error('Payment creation failed:', paymentError);
            await transaction.rollback();
            return res.status(500).json({
                success: false,
                message: 'Failed to create payment record.',
                error: paymentError.message,
            });
        }

        // Verify Patient exists for Notification
        const patient = await Patient.findByPk(patientId);
        if (!patient) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Patient not found.',
            });
        }

        // Create Notification
        try {
            const notification = await Notification.create({
                patientId,
                appointmentId: appointment.id,
                message: `Your appointment on ${new Date(date).toLocaleDateString()} from ${StartTime} to ${EndTime} has been confirmed.`,
                type: 'confirmation',
                isRead: false,
            }, { transaction });

            console.log('Created Notification:', notification.toJSON());
        } catch (notificationError) {
            console.error('Notification creation failed:', notificationError);
            await transaction.rollback();
            return res.status(500).json({
                success: false,
                message: 'Failed to create notification record.',
                error: notificationError.message,
            });
        }

        await transaction.commit();

        return res.status(200).json({
            success: true,
            message: 'Payment status updated and appointment confirmed.',
            appointmentId: appointment.id,
        });
    } catch (error) {
        console.error('Error updating payment status:', error);
        await transaction.rollback();
        return res.status(500).json({
            success: false,
            message: 'Server error: Could not update payment status or create appointment.',
            error: error.message,
        });
    }
};

module.exports = { createPaymentIntent, updatePaymentStatus };