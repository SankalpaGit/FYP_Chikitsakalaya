import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPills } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdEventNote } from "react-icons/md";
import PatientLayout from "../../layouts/PatientLayout";

const Prescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const parseFrequency = (frequencyStr) => {
      const match = frequencyStr.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    };

    const parseDuration = (durationStr) => {
      const match = durationStr.match(/(\d+)/);
      return match ? parseInt(match[1], 10) : 1;
    };

    const calculateRemainingDoses = (createdAt, frequencyPerDay, durationInDays) => {
      const totalDoses = frequencyPerDay * durationInDays;
      const daysPassed = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
      const dosesTaken = Math.min(daysPassed * frequencyPerDay, totalDoses);
      return totalDoses - dosesTaken;
    };

    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/prescription/patient", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const formatted = response.data.prescriptions.map((p) => ({
            id: p.id,
            prescriptionId: p.id,
            diagnosis: p.diagnosis || "N/A",
            doctorName: p.Appointment?.Doctor?.firstName || "Unknown",
            date: new Date(p.createdAt).toDateString(),
            status: "Active",
            medications: p.PrescriptionMedicines.map((m) => {
              const freq = parseFrequency(m.frequency);
              const dur = parseDuration(m.duration);
              const remainingDoses = calculateRemainingDoses(p.createdAt, freq, dur);
              const totalDoses = freq * dur;

              return {
                name: m.medicineName,
                dosage: m.dosage,
                frequency: m.frequency,
                duration: m.duration,
                instructions: m.instructions,
                remainingDoses,
                totalDoses,
              };
            }),
          }));

          setPrescriptions(formatted);
        } else {
          setError("Failed to load prescriptions.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching prescriptions.");
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  return (
    <PatientLayout>
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Your Prescriptions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : prescriptions.length > 0 ? (
          prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="border rounded-lg p-5 shadow-md bg-white mb-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">
                    {prescription.diagnosis}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Dr {prescription.doctorName} • {prescription.date}
                  </p>
                </div>
                <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full">
                  {prescription.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {prescription.medications.map((med, index) => (
                  <p key={index} className="flex items-center gap-2 text-gray-700">
                    <FaPills className="text-gray-500" /> {med.name} - {med.dosage}
                  </p>
                ))}
              </div>

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

        {/* Modal */}
        {selectedPrescription && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[500px] max-h-[90vh] overflow-auto relative">
              <button
                className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                onClick={() => setSelectedPrescription(null)}
              >
                <IoMdClose size={20} />
              </button>

              <h2 className="text-xl font-semibold">Prescription Details</h2>
              <p className="text-gray-500 text-sm">
                Prescription #{selectedPrescription.prescriptionId}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="bg-teal-500 text-white text-sm px-3 py-1 rounded-full">
                  {selectedPrescription.status}
                </span>
                <p className="text-gray-500 text-sm">{selectedPrescription.date}</p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="font-semibold flex items-center gap-2">
                  <MdEventNote className="text-gray-500" /> Doctor
                </p>
                <p className="text-gray-700">{selectedPrescription.doctorName}</p>

                <p className="font-semibold flex items-center gap-2">
                  <MdEventNote className="text-gray-500" /> Diagnosis
                </p>
                <p className="text-gray-700">{selectedPrescription.diagnosis}</p>
              </div>

              <h3 className="text-lg font-semibold mt-5">Medications</h3>
              {selectedPrescription.medications.map((med, index) => {
                const dosesTaken = med.totalDoses - med.remainingDoses;
                const progress = (dosesTaken / med.totalDoses) * 100;

                return (
                  <div key={index} className="border rounded-lg p-4 mt-3 bg-gray-50">
                    <h4 className="font-semibold">{med.name}</h4>
                    <p className="text-sm text-gray-500">{med.dosage}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-700 mt-2">
                      <span className="flex items-center gap-1">🔄 {med.frequency}</span>
                      <span className="flex items-center gap-1">📅 {med.duration}</span>
                    </div>

                    <p className="mt-2 text-gray-700">
                      <span className="font-semibold">Instructions:</span> {med.instructions}
                    </p>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Progress</p>
                      <div className="w-full bg-gray-200 h-2 rounded-full mt-1">
                        <div
                          className="bg-teal-500 h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {med.remainingDoses} doses remaining out of {med.totalDoses}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default Prescription;
