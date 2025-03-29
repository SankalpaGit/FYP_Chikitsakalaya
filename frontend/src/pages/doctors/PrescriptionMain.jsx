import React, { useState } from "react";
import DoctorLayout from "../../layouts/DoctorLayout";
import { RiDeleteBin6Line } from "react-icons/ri";

const PrescriptionMain = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [medications, setMedications] = useState([
    { id: 1, name: "", dosage: "", frequency: "", duration: "", instructions: "" },
  ]);

  // Add Medication
  const addMedication = () => {
    setMedications([
      ...medications,
      { id: Date.now(), name: "", dosage: "", frequency: "", duration: "", instructions: "" },
    ]);
  };

  // Delete Medication
  const deleteMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-2xl border mx-auto p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Create Prescription</h2>
        <div className="space-y-6">
          {/* Patient & Date */}
          <div className="flex gap-4 w-full">
            <div className="w-1/2">
              <label className="block font-medium mb-2">Patient</label>
              <select className="w-full p-3 border rounded-md">
                <option>Sarah Johnson</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block font-medium  mb-2">Date</label>
              <input
                type="date"
                className="w-full p-3 border rounded-md"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Patient Information */}
          <div className="p-5 border rounded-md bg-gray-50">
            <p className="font-semibold">Patient Information</p>
            <p>Name: Sarah Johnson</p>
            <p>Age: 32 years</p>
            <p>Gender: Female</p>
          </div>

          {/* Diagnosis */}
          <div>
            <label className="block font-medium mb-2">Diagnosis</label>
            <input
              type="text"
              className="w-full p-3 border rounded-md"
              placeholder="Enter diagnosis"
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

            {/* Medication List */}
            {medications.map((med, index) => (
              <div key={med.id} className="relative p-5 border rounded-md space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold">Medication #{index + 1}</p>
                  {/* Show delete button only if there's more than one medication */}
                  {medications.length > 1 && (
                    <button onClick={() => deleteMedication(med.id)} className="text-red-600">
                      <RiDeleteBin6Line className="text-xl" />
                    </button>
                  )}
                </div>

                <div className="flex gap-4 w-full">
                  <div className="w-1/2">
                    <label className="block font-medium mb-2">Medication Name</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>Amoxicillin</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block font-medium mb-2">Dosage</label>
                    <input
                      type="text"
                      className="w-full p-3 border rounded-md"
                      placeholder="e.g - 500mg"
                    />
                  </div>
                </div>

                <div className="flex gap-4 w-full">
                  <div className="w-1/2">
                    <label className="block font-medium mb-2">Frequency</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>Three times daily</option>
                    </select>
                  </div>
                  <div className="w-1/2">
                    <label className="block font-medium mb-2">Duration</label>
                    <select className="w-full p-3 border rounded-md">
                      <option>10 days</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2">Special Instructions</label>
                  <textarea
                    className="w-full p-3 border rounded-md"
                    placeholder="e.g., Take with food"
                  ></textarea>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block font-medium mb-2">Additional Notes</label>
            <textarea
              className="w-full p-3 border rounded-md"
              placeholder="Any additional instructions or notes"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button className="px-4 py-2 border rounded-md">Cancel</button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-md">
              Create Prescription
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default PrescriptionMain;
