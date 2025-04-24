const express = require('express');
const jwt = require('jsonwebtoken');
const { Appointment, Payment, Patient } = require('../models');
const DoctorWallet = require('../models/DoctorWallet');
const WithdrawalHistory = require('../models/WithdrawalHistory');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');

// Get paid appointments for the logged-in doctor
router.get('/doctor/paid', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId;

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

// Get wallet balance and withdrawal history
router.get('/wallet', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId;

        let wallet = await DoctorWallet.findOne({ where: { doctorId } });
        console.log('Wallet Data:', wallet ? wallet.toJSON() : 'No wallet found');

        // If no wallet exists, create one
        if (!wallet) {
            wallet = await DoctorWallet.create({ doctorId, balance: 0, remainBalance: 0 });
            console.log('Created New Wallet:', wallet.toJSON());
        }

        // If remainBalance is 0, initialize it with totalEarnings
        if (wallet.remainBalance === 0) {
            const appointments = await Appointment.findAll({
                where: { doctorId },
                include: [{ model: Payment, where: { paymentStatus: 'paid' }, required: true }],
            });
            const totalEarnings = appointments.reduce((sum, appt) => sum + (Number(appt.Payment?.amount) || 0), 0);
            await wallet.update({ remainBalance: totalEarnings });
            console.log('Initialized remainBalance:', wallet.toJSON());
        }

        const history = await WithdrawalHistory.findAll({
            where: { doctorId },
            order: [['createdAt', 'DESC']],
        });

        return res.status(200).json({
            success: true,
            data: {
                balance: Number(wallet.balance) || 0,
                remainBalance: Number(wallet.remainBalance) || 0,
                withdrawalHistory: history,
            },
        });
    } catch (error) {
        console.error('Error fetching wallet:', error);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
});

// Process withdrawal (unchanged for now, but add logging)
router.post('/withdraw', authenticateToken, async (req, res) => {
    try {
        const doctorId = req.user.doctorId;
        const { amount } = req.body;

        console.log('Withdrawal Request:', { doctorId, amount });

        if (!amount || amount <= 0) {
            console.log('Invalid withdrawal amount');
            return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
        }

        let wallet = await DoctorWallet.findOne({ where: { doctorId } });
        console.log('Wallet Before:', wallet ? wallet.toJSON() : 'No wallet');

        if (!wallet) {
            wallet = await DoctorWallet.create({ doctorId, balance: 0, remainBalance: 0 });
            console.log('Created New Wallet:', wallet.toJSON());
        }

        let totalEarnings = wallet.remainBalance;
        if (totalEarnings === 0) {
            const appointments = await Appointment.findAll({
                where: { doctorId },
                include: [{ model: Payment, where: { paymentStatus: 'paid' }, required: true }],
            });
            totalEarnings = appo
System: intments.reduce((sum, appt) => sum + (Number(appt.Payment?.amount) || 0), 0);
            await wallet.update({ remainBalance: totalEarnings });
            console.log('Initialized remainBalance:', wallet.toJSON());
        }

        if (amount > wallet.remainBalance) {
            console.log('Insufficient remainBalance:', { requested: amount, available: wallet.remainBalance });
            return res.status(400).json({ success: false, message: 'Insufficient remaining balance for withdrawal' });
        }

        const deduction = amount * 0.15;
        const amountReceived = amount - deduction;

        await wallet.update({
            balance: Number(wallet.balance) + amountReceived,
            remainBalance: Number(wallet.remainBalance) - amount,
        });

        console.log('Wallet After:', wallet.toJSON());

        await WithdrawalHistory.create({
            doctorId,
            amountRequested: amount,
            deduction,
            amountReceived,
            status: 'completed',
        });

        console.log('Withdrawal Response:', {
            amountRequested: amount,
            deduction,
            amountReceived,
            newBalance: wallet.balance,
            remainBalance: wallet.remainBalance,
        });

        return res.status(200).json({
            success: true,
            data: {
                amountRequested: amount,
                deduction,
                amountReceived,
                newBalance: wallet.balance,
                remainBalance: wallet.remainBalance,
            },
        });
    } catch (error) {
        console.error('Error processing withdrawal:', error);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
});

module.exports = router;