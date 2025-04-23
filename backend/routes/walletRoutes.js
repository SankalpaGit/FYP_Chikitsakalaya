// routes/walletRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const { Appointment, Payment, Patient} = require('../models');
const DoctorWallet = require('../models/DoctorWallet');
const WithdrawalHistory = require('../models/WithdrawalHistory');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// Get paid appointments for the logged-in doctor
router.get('/doctor/paid', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId; // Adjusted to match decoded.doctorId

        const appointments = await Appointment.findAll({
            where: { doctorId },
            include: [
                {
                    model: Payment,
                    where: { paymentStatus: 'paid' },
                    required: true,
                    attributes: ['amount', 'paymentStatus'],
                },
                {
                    model: Patient,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            attributes: ['id', 'date', 'StartTime', 'EndTime', 'appointmentType', 'description'],
        });

        const totalEarnings = appointments.reduce((sum, appt) => sum + (Number(appt.Payment?.amount) || 0), 0);

        return res.status(200).json({
            success: true,
            data: {
                appointments,
                totalEarnings,
            },
        });
    } catch (error) {
        console.error('Error fetching payments:', error);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
});

// Process withdrawal
router.post('/withdraw', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId;
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
        }

        // Calculate total earnings
        const appointments = await Appointment.findAll({
            where: { doctorId },
            include: [{ model: Payment, where: { paymentStatus: 'paid' }, required: true }],
        });
        const totalEarnings = appointments.reduce((sum, appt) => sum + (Number(appt.Payment?.amount) || 0), 0);

        // Check if enough balance
        if (amount > totalEarnings) {
            return res.status(400).json({ success: false, message: 'Insufficient earnings for withdrawal' });
        }

        // Calculate deduction (15%)
        const deduction = amount * 0.15;
        const amountReceived = amount - deduction;

        // Update or create DoctorWallet
        let wallet = await DoctorWallet.findOne({ where: { doctorId } });
        if (!wallet) {
            wallet = await DoctorWallet.create({ doctorId, balance: 0 });
        }
        await wallet.update({ balance: Number(wallet.balance) + amountReceived });

        // Log withdrawal
        await WithdrawalHistory.create({
            doctorId,
            amountRequested: amount,
            deduction,
            amountReceived,
            status: 'completed',
        });

        return res.status(200).json({
            success: true,
            data: {
                amountRequested: amount,
                deduction,
                amountReceived,
                newBalance: wallet.balance,
            },
        });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
});

// Get wallet balance and withdrawal history
router.get('/wallet', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId;

        const wallet = await DoctorWallet.findOne({ where: { doctorId } });
        const history = await WithdrawalHistory.findAll({
            where: { doctorId },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            data: {
                balance: wallet ? Number(wallet.balance) : 0,
                withdrawalHistory: history,
            },
        });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
});

module.exports = router;