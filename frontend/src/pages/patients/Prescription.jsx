import React, { useState } from "react";
import { FaPills } from "react-icons/fa";
import { IoMdClose } from "react-icons/io"; // Close icon
import { MdEventNote } from "react-icons/md"; // Calendar icon
import PatientLayout from "../../layouts/PatientLayout";

const Prescription = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Dummy prescriptions data (Replace with API data)
  const prescriptions = [
    {
      id: 1,
      prescriptionId: "RX12345",
      diagnosis: "Seasonal Allergies",
      doctor: "Dr. Sarah Johnson",
      date: "Mar 25, 2025",
      status: "Active",
      medications: [
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Take in the morning",
          remainingDoses: 22,
        },
        {
          name: "Fluticasone Nasal Spray",
          dosage: "50mcg/spray, 2 sprays per nostril",
          frequency: "Once daily",
          duration: "30 days",
          instructions: "Use in the morning after showering",
          remainingDoses: 22,
        },
      ],
    },
  ];

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Prescriptions</h2>

        {prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="border rounded-lg p-5 shadow-md bg-white mb-4"
            >
              {/* Header - Diagnosis & Status */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {prescription.diagnosis}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {prescription.doctor} • {prescription.date}
                  </p>
                </div>
                <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full">
                  {prescription.status}
                </span>
              </div>

              {/* Medications List */}
              <div className="mt-3 space-y-2">
                {prescription.medications.map((med, index) => (
                  <p key={index} className="flex items-center gap-2 text-gray-700">
                    <FaPills className="text-gray-500" /> {med.name} - {med.dosage}
                  </p>
                ))}
              </div>

              {/* View Details Button */}
              <button
                className="w-full mt-4 border rounded-md py-2 text-center text-white font-semibold bg-orange-500"
                onClick={() => setSelectedPrescription(prescription)}
              >
                View Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No prescriptions available</p>
        )}

        {/* Prescription Details Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-auto relative">
              {/* Close Button */}
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedPrescription(null)}
              >
                <IoMdClose size={20} />
              </button>

              {/* Modal Header */}
              <h2 className="text-xl font-semibold">Prescription Details</h2>
              <p className="text-gray-500 text-sm">
                Prescription #{selectedPrescription.prescriptionId}
              </p>

              {/* Status & Date */}
              <div className="flex justify-between items-center mt-3">
                <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full">
                  {selectedPrescription.status}
                </span>
                <p className="text-gray-500 text-sm">{selectedPrescription.date}</p>
              </div>

              {/* Doctor & Diagnosis */}
              <div className="mt-4 space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <MdEventNote className="text-gray-500" /> Doctor
                </p>
                <p className="text-gray-700">{selectedPrescription.doctor}</p>

                <p className="font-semibold flex items-center gap-2">
                  <MdEventNote className="text-gray-500" /> Diagnosis
                </p>
                <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
              </div>

              {/* Medications Section */}
              <h3 className="text-lg font-semibold mt-5">Medications</h3>

              {selectedPrescription.medications.map((med, index) => (
                <div key={index} className="border rounded-lg p-4 mt-3 bg-gray-50">
                  <h4 className="font-semibold">{med.name}</h4>
                  <p className="text-sm text-gray-500">{med.dosage}</p>

                  {/* Frequency & Duration */}
                  <div className="flex items-center gap-4 text-sm text-gray-700 mt-2">
                    <span className="flex items-center gap-1">
                      🔄 {med.frequency}
                    </span>
                    <span className="flex items-center gap-1">📅 {med.duration}</span>
                  </div>

                  {/* Instructions */}
                  <p className="mt-2 text-gray-700">
                    <span className="font-semibold">Instructions:</span> {med.instructions}
                  </p>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <p className="text-sm text-gray-500">Progress</p>
                    <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: `${(med.remainingDoses / 30) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {med.remainingDoses} doses remaining
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default Prescription;
