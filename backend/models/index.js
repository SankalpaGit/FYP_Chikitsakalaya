const sequelize = require('../config/database');

// Import models
const Patient = require('./patient');
const PatientReport = require('./PatientReport');
const Diagnosis = require('./Diagnosis');
const Test = require('./Test');
const Medication = require('./Medication');
const Doctor = require('./Doctor');
const DoctorDetail = require('./DoctorDetail');
const TimeSlot = require('./TimeSlot');
const Appointment = require('./Appointment');

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
Doctor.hasOne(DoctorDetail, { foreignKey: 'doctorId', onDelete: 'CASCADE', onUpdate: 'CASCADE' , as: 'doctorDetail' });
DoctorDetail.belongsTo(Doctor, { foreignKey: 'doctorId' , as: 'doctorDetail' });

// Doctor → TimeSlots
Doctor.hasMany(TimeSlot, { foreignKey: 'doctorId', onDelete: 'CASCADE' });
TimeSlot.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Doctor → Appointment
Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Patient → Appointment
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });


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
};
