import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/view/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <DoctorLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="border p-4 rounded-lg shadow-md">
                <p><strong>Patient:</strong> {appointment.patient.firstName} {appointment.patient.lastName}</p>
                <p><strong>Date:</strong> {appointment.date}</p>
                <p><strong>Time:</strong> {appointment.StartTime} - {appointment.EndTime}</p>
                <p><strong>Type:</strong> {appointment.appointmentType}</p>
                <p><strong>Description:</strong> {appointment.description || 'No description'}</p>
                <p><strong>Payment Status:</strong> {appointment.payment?.paymentStatus || 'Unknown'}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default AppointmentList;
