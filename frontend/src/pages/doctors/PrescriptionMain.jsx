import React, { useState, useEffect } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";

const PrescriptionMain = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);

  const BACKEND_URL = "http://localhost:5000"; // ⚠️ Set this to your backend base URL

  // Fetch completed patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/appointments/completed-patients`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("Completed Patients API Response:", res.data);

        const patientList = Array.isArray(res.data)
          ? res.data
          : res.data.patients || [];

        setPatients(patientList);
        if (patientList.length > 0) setSelectedPatient(patientList[0]);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
    };

    fetchPatients();
  }, []);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now(),
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const deleteMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const handleChangeMedication = (id, field, value) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedPatient) return alert("Please select a patient");
  
    const payload = {
      appointmentId: selectedPatient.appointmentId,
      diagnosis,
      notes,
      medications: medications.map(({ id, name, ...med }) => ({
        ...med,
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
    } catch (err) {
      console.error("Failed to create prescription", err);
      alert("Failed to create prescription");
    }
  };
  

  return (
    <DoctorLayout>
      <div className="max-w-2xl border mx-auto p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Create Prescription</h2>
        <div className="space-y-6">
          {/* Patient */}
          <div className="w-full">
            <label className="block font-medium mb-2">Patient</label>
            <select
              className="w-full p-3 border rounded-md"
              onChange={(e) =>
                setSelectedPatient(
                  patients.find((p) => p.id === e.target.value)
                )
              }
            >
              <option value="">Select a patient</option>
              {Array.isArray(patients) &&
                patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block font-medium mb-2">Diagnosis</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Enter diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            />
          </div>

          {/* Medications Section */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Medications</h3>
              <button
                className="border border-teal-600 px-2 py-2 rounded-md font-semibold text-gray-600"
                onClick={addMedication}
              >
                + Add Medication
              </button>
            </div>

            {medications.map((med, index) => (
              <div key={med.id} className="p-5 border rounded-md mb-4 space-y-3">
                <div className="flex justify-between">
                  <p className="font-semibold">Medication #{index + 1}</p>
                  {medications.length > 1 && (
                    <button
                      onClick={() => deleteMedication(med.id)}
                      className="text-red-600"
                    >
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  )}
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-1/2 p-3 border rounded-md"
                    placeholder="Medication name"
                    value={med.name}
                    onChange={(e) =>
                      handleChangeMedication(med.id, "name", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="w-1/2 p-3 border rounded-md"
                    placeholder="Dosage"
                    value={med.dosage}
                    onChange={(e) =>
                      handleChangeMedication(med.id, "dosage", e.target.value)
                    }
                  />
                </div>

                <div className="flex gap-4">
                  <input
                    type="text"
                    className="w-1/2 p-3 border rounded-md"
                    placeholder="Frequency"
                    value={med.frequency}
                    onChange={(e) =>
                      handleChangeMedication(med.id, "frequency", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    className="w-1/2 p-3 border rounded-md"
                    placeholder="Duration"
                    value={med.duration}
                    onChange={(e) =>
                      handleChangeMedication(med.id, "duration", e.target.value)
                    }
                  />
                </div>

                <textarea
                  className="w-full p-3 border rounded-md"
                  placeholder="Instructions"
                  value={med.instructions}
                  onChange={(e) =>
                    handleChangeMedication(med.id, "instructions", e.target.value)
                  }
                ></textarea>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium mb-2">Additional Notes</label>
            <textarea
              className="w-full p-3 border rounded-md"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional instructions or notes"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-md">Cancel</button>
            <button
              className="px-4 py-2 bg-orange-600 text-white rounded-md"
              onClick={handleSubmit}
            >
              Create Prescription
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default PrescriptionMain;
