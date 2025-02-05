const sequelize = require('../config/database');

// Import models
const Patient = require('./Patient');
const PatientReport = require('./PatientReport');
const Diagnosis = require('./Diagnosis');
const Test = require('./Test');
const Medication = require('./Medication');

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


// ✅ Export Models
module.exports = {
  sequelize,
  Patient,
  PatientReport,
  Diagnosis,
  Test,
  Medication,
};
