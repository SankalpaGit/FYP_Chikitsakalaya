const cron = require('node-cron');
const { Appointment, Notification, Doctor } = require('../models');
const { Op } = require('sequelize');

// Configurable reminder times (in hours)
const REMINDER_TIMES = [
  { hours: 1, label: 'one hour' }, // 1-hour reminder
  { hours: 0.1667, label: 'less than 10 minutes' }, // 10-minute reminder (0.1667 hours = 10 minutes)
];

const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${minute} ${ampm}`;
};

const scheduleAppointmentReminders = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const maxReminderTime = Math.max(...REMINDER_TIMES.map(t => t.hours));
            const maxWindowEnd = new Date(now.getTime() + maxReminderTime * 60 * 60 * 1000);

            const appointments = await Appointment.findAll({
                where: {
                    date: {
                        [Op.eq]: now.toISOString().split('T')[0],
                    },
                    StartTime: {
                        [Op.between]: [
                            now.toTimeString().slice(0, 8),
                            maxWindowEnd.toTimeString().slice(0, 8),
                        ],
                    },
                    isComplete: false,
                    isCancelled: false,
                },
                include: [
                    { model: Doctor,  attributes: ['firstName'] },
                ],
            });

            for (const appt of appointments) {
                const doctorName = appt.doctor?.firstName || 'Doctor';
                const apptTime = new Date(`${appt.date}T${appt.StartTime}`);

                for (const reminder of REMINDER_TIMES) {
                    const windowStart = new Date(now.getTime() + (reminder.hours * 60 * 60 * 1000 - 60 * 1000));
                    const windowEnd = new Date(now.getTime() + (reminder.hours * 60 * 60 * 1000));

                    if (apptTime >= windowStart && apptTime <= windowEnd) {
                        const existingReminder = await Notification.findOne({
                            where: {
                                patientId: appt.patientId,
                                appointmentId: appt.id,
                                message: {
                                    [Op.like]: `%Your appointment with Dr. ${doctorName} is about to start in ${reminder.label}%`,
                                },
                                createdAt: {
                                    [Op.gte]: new Date(now.getTime() - 60 * 1000),
                                },
                            },
                        });

                        if (!existingReminder) {
                            await Notification.create({
                                patientId: appt.patientId,
                                appointmentId: appt.id,
                                message: `Your appointment with Dr. ${doctorName} is about to start in ${reminder.label} on ${new Date(appt.date).toLocaleDateString()} at ${formatTime(appt.StartTime)} ${appt.appointmentType === 'physical' ? `at ${appt.hospitalAffiliation}` : ''}`,
                                type: 'reminder',
                            });
                        }
                    }
                }
            }
            console.log('Ran appointment reminder cron job');
        } catch (err) {
            console.error('Error in reminder cron job:', err);
        }
    });
};

module.exports = {
    initCrons: () => {
        console.log('Initializing cron jobs...');
        scheduleAppointmentReminders();
    },
};