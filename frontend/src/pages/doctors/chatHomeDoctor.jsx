import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ChatHomeDoctor = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token"); // Assuming token is stored
        const response = await axios.get("http://localhost:5000/api/chat/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Patients</h2>
      {patients.length > 0 ? (
        patients.map((patient) => (
          <div
            key={patient.patientId}
            className="p-2 border-b cursor-pointer hover:bg-gray-100"
            onClick={() => navigate(`/doctor/chat/${patient.patientId}`)}
          >
            {patient.firstName} {patient.lastName}
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
};

export default ChatHomeDoctor;
