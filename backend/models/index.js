const sequelize = require('../config/database');

// Import models
const Patient = require('./Patient');
const PatientReport = require('./PatientReport');
const Diagnosis = require('./Diagnosis');
const Test = require('./Test');
const Medication = require('./Medication');
const Doctor = require('./Doctor');
const DoctorDetail = require('./DoctorDetail');
const TimeSlot = require('./TimeSlot');
const Appointment = require('./Appointment');
const Payment = require('./Payment');
const PhysicalTicket = require('./PhysicalTicket');
const Chat = require('./Chat');
const OnlinePortal = require('./OnlinePortal');

// ✅ Define Relationships

// Patient → Reports
Patient.hasMany(PatientReport, { foreignKey: 'patientId', onDelete: 'CASCADE' });
PatientReport.belongsTo(Patient, { foreignKey: 'patientId' });

// Patient → Diagnoses
Patient.hasMany(Diagnosis, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Diagnosis.belongsTo(Patient, { foreignKey: 'patientId' });

// Patient → Tests
Patient.hasMany(Test, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Test.belongsTo(Patient, { foreignKey: 'patientId' });

// Patient → Medications
Patient.hasMany(Medication, { foreignKey: 'patientId', onDelete: 'CASCADE' });
Medication.belongsTo(Patient, { foreignKey: 'patientId' });

// Doctor → DoctorDetail 
Doctor.hasMany(DoctorDetail, { foreignKey: 'doctorId', onDelete: 'CASCADE', onUpdate: 'CASCADE' , as: 'doctorDetails' });
DoctorDetail.belongsTo(Doctor, { foreignKey: 'doctorId' , as: 'doctor' });

// Doctor → TimeSlots
Doctor.hasMany(TimeSlot, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Doctor → Appointment
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

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

// One-to-Many: A Patient can send/receive multiple messages
Patient.hasMany(Chat, { foreignKey: "senderId", as: "sentMessages" });
Patient.hasMany(Chat, { foreignKey: "receiverId", as: "receivedMessages" });

// One-to-Many: A Doctor can send/receive multiple messages
Doctor.hasMany(Chat, { foreignKey: "senderId", as: "sentMessages" });
Doctor.hasMany(Chat, { foreignKey: "receiverId", as: "receivedMessages" });

// Chat belongs to both sender and receiver
Chat.belongsTo(Patient, { foreignKey: "senderId", as: "sender" });
Chat.belongsTo(Patient, { foreignKey: "receiverId", as: "receiver" });

Chat.belongsTo(Doctor, { foreignKey: "senderId", as: "sender" });
Chat.belongsTo(Doctor, { foreignKey: "receiverId", as: "receiver" });



// ✅ Export Models
module.exports = {
  sequelize,
  Patient,
  PatientReport,
  Diagnosis,
  Test,
  Medication,
  Doctor,
  DoctorDetail,
  TimeSlot,
  Appointment,
  Payment,
  PhysicalTicket,
  Chat,
};
