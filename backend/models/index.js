const sequelize = require('../config/database');

// Import models
const Patient = require('./Patient');
const PatientReport = require('./PatientReport');
const Doctor = require('./Doctor');
const DoctorDetail = require('./DoctorDetail');
const TimeSlot = require('./TimeSlot');
const Appointment = require('./Appointment');
const Payment = require('./Payment');
const PhysicalTicket = require('./PhysicalTicket');
const Chat = require('./Chat');
const TaskList = require('./TaskList');
const OnlinePortal = require('./OnlinePortal');
const Prescription = require('./Prescription');
const PrescriptionMedicine = require('./PrescriptionMedicine');
const Notification = require('./Notification');
const DoctorWallet = require('./DoctorWallet');
const WithdrawalHistory = require('./WithdrawalHistory');
const FollowUp = require('./FollowUp'); 
// ✅ Define Relationships

// Patient → Reports
Patient.hasMany(PatientReport, { foreignKey: 'patientId', onDelete: 'CASCADE' });
PatientReport.belongsTo(Patient, { foreignKey: 'patientId' });


// Doctor → DoctorDetail 
Doctor.hasMany(DoctorDetail, { foreignKey: 'doctorId', onDelete: 'CASCADE', onUpdate: 'CASCADE', as: 'doctorDetails' });
DoctorDetail.belongsTo(Doctor, { foreignKey: 'doctorId', as: 'doctor' });

// Doctor → TimeSlots
Doctor.hasMany(TimeSlot, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Doctor → Appointment
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Appointment → FollowUp
Appointment.hasMany(FollowUp, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
FollowUp.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Doctor → Tasks
Doctor.hasMany(TaskList, { foreignKey: 'doctorId' ,  onDelete: "CASCADE"});
TaskList.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Patient → Appointment
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

// Appointment → Payment 
Appointment.hasOne(Payment, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Payment.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Appointment → PhysicalTicket
Appointment.hasOne(PhysicalTicket, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
PhysicalTicket.belongsTo(Appointment, { foreignKey: 'appointmentId' });

Appointment.hasOne(OnlinePortal, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
OnlinePortal.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Chat → Appointment
Chat.belongsTo(Appointment, { foreignKey: 'appointmentId' });
Appointment.hasMany(Chat, { foreignKey: 'appointmentId' });

// Appointment → Prescription
Appointment.hasOne(Prescription, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Prescription.belongsTo(Appointment, { foreignKey: 'appointmentId' });

// Prescription → PrescriptionMedicine
Prescription.hasMany(PrescriptionMedicine, { foreignKey: 'prescriptionId', onDelete: 'CASCADE' });
PrescriptionMedicine.belongsTo(Prescription, { foreignKey: 'prescriptionId' });


// Notification → Patient
Patient.hasMany(Notification, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Notification.belongsTo(Patient, { foreignKey: 'patientId' });

Appointment.hasMany(Notification, { foreignKey: 'appointmentId', onDelete: 'CASCADE' });
Notification.belongsTo(Appointment, { foreignKey: 'appointmentId' });


// DoctorWallet associations
DoctorWallet.belongsTo(Doctor, { foreignKey: 'doctorId' });
Doctor.hasOne(DoctorWallet, { foreignKey: 'doctorId' });

// WithdrawalHistory associations
WithdrawalHistory.belongsTo(Doctor, { foreignKey: 'doctorId' });
WithdrawalHistory.belongsTo(Appointment, { foreignKey: 'appointmentId', constraints: false }); // Nullable
Doctor.hasMany(WithdrawalHistory, { foreignKey: 'doctorId' });

// ✅ Export Models
module.exports = {
  sequelize,
  Patient,
  PatientReport,
  Doctor,
  DoctorDetail,
  TimeSlot,
  Appointment,
  Payment,
  PhysicalTicket,
  Chat,
  Prescription,
  PrescriptionMedicine,
  Notification,
  TaskList,
  OnlinePortal,
};
