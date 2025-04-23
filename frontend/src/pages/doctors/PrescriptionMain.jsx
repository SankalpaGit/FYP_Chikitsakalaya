import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { FaUser, FaCalendarAlt, FaPills } from "react-icons/fa";
import axios from "axios";

const PrescriptionMain = () => {
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);
  const [showModal, setShowModal] = useState(false);

  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/appointments/completed-patients`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const patientList = Array.isArray(res.data) ? res.data : res.data.patients || [];
        setPatients(patientList);
        if (patientList.length > 0) setSelectedPatient(patientList[0]);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
    };
    fetchPatients();
  }, []);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/prescription/doctor`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setPrescriptions(res.data.prescriptions || []);
      } catch (err) {
        console.error("Failed to fetch prescriptions", err);
      }
    };
    fetchPrescriptions();
  }, [showModal]);

  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  const deleteMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleChangeMedication = (id, field, value) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return alert("Please select a patient");
    const payload = {
      appointmentId: selectedPatient.appointmentId,
      diagnosis,
      notes,
      medications: medications.map(({ id, name, ...rest }) => ({
        ...rest,
        medicineName: name,
      })),
    };
    try {
      await axios.post(`${BACKEND_URL}/api/prescriptions`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Prescription created successfully");
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create prescription", err);
      alert("Failed to create prescription");
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Your Prescriptions</h2>
          <button
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition duration-200 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            + Add Prescription
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Diagnosis</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">Medications</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prescriptions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No prescriptions found.
                    </td>
                  </tr>
                ) : (
                  prescriptions.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition duration-150 text-lg">
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        <div className="flex items-center">
                          <FaUser className="mr-2 text-teal-500" />
                          {p.Appointment?.Patient?.firstName || "N/A"} {p.Appointment?.Patient?.lastName || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{p.diagnosis || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-teal-500" />
                          {new Date(p.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-start">
                          <FaPills className="mr-2 text-teal-500 mt-1" />
                          <ul className="list-disc list-inside">
                            {p.PrescriptionMedicines?.length > 0 ? (
                              p.PrescriptionMedicines.map((med, i) => (
                                <span key={i}>
                                  {med.medicineName} ({med.dosage}) – {med.frequency} for {med.duration}
                                </span>
                              ))
                            ) : (
                              <li>No medications</li>
                            )}
                          </ul>
                        </div>
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <IoMdClose size={24} />
              </button>

              <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>

              {/* Patient */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Patient</label>
                <select
                  className="w-full p-3 border rounded-md"
                  onChange={(e) =>
                    setSelectedPatient(patients.find((p) => p.id === e.target.value))
                  }
                >
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Diagnosis */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Diagnosis</label>
                <input
                  type="text"
                  className="w-full p-3 border rounded-md"
                  placeholder="Enter diagnosis"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="mb-4">
                <label className="block font-medium mb-2">Additional Notes</label>
                <textarea
                  className="w-full p-3 border rounded-md"
                  placeholder="Enter any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Medications */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Medications</h3>
                  <button className="text-sm text-orange-600" onClick={addMedication}>
                    + Add
                  </button>
                </div>
                {medications.map((med, index) => (
                  <div key={med.id} className="border p-3 mb-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">#{index + 1}</p>
                      {medications.length > 1 && (
                        <RiDeleteBin6Line
                          className="text-red-500 cursor-pointer"
                          onClick={() => deleteMedication(med.id)}
                        />
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <input
                        className="border p-2 rounded"
                        placeholder="Medicine Name"
                        value={med.name}
                        onChange={(e) => handleChangeMedication(med.id, "name", e.target.value)}
                      />
                      <input
                        className="border p-2 rounded"
                        placeholder="Dosage"
                        value={med.dosage}
                        onChange={(e) => handleChangeMedication(med.id, "dosage", e.target.value)}
                      />
                      <input
                        className="border p-2 rounded"
                        placeholder="Frequency"
                        value={med.frequency}
                        onChange={(e) => handleChangeMedication(med.id, "frequency", e.target.value)}
                      />
                      <input
                        className="border p-2 rounded"
                        placeholder="Duration"
                        value={med.duration}
                        onChange={(e) => handleChangeMedication(med.id, "duration", e.target.value)}
                      />
                    </div>

                    {/* Instructions */}
                    <div className="mt-2">
                      <textarea
                        className="w-full border p-2 rounded mt-2"
                        placeholder="Instructions"
                        value={med.instructions}
                        onChange={(e) =>
                          handleChangeMedication(med.id, "instructions", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  className="px-4 py-2 bg-orange-600 text-white rounded-md"
                  onClick={handleSubmit}
                >
                  Submit Prescription
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default PrescriptionMain;