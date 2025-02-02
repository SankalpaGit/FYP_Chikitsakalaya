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

// Report → Diagnoses
PatientReport.hasMany(Diagnosis, { foreignKey: 'reportId', onDelete: 'CASCADE' });
Diagnosis.belongsTo(PatientReport, { foreignKey: 'reportId' });

// Report → Tests
PatientReport.hasMany(Test, { foreignKey: 'reportId', onDelete: 'CASCADE' });
Test.belongsTo(PatientReport, { foreignKey: 'reportId' });

// Report → Medications
PatientReport.hasMany(Medication, { foreignKey: 'reportId', onDelete: 'CASCADE' });
Medication.belongsTo(PatientReport, { foreignKey: 'reportId' });

// ✅ Export Models
module.exports = {
  sequelize,
  Patient,
  PatientReport,
  Diagnosis,
  Test,
  Medication,
};
