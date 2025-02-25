import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaClock, FaDollarSign } from 'react-icons/fa';
import PatientLayout from '../../layouts/PatientLayout';

const DisplayAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        console.error('No token found, user might be logged out.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/view/appointments', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  return (
    <PatientLayout>
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">Your Appointments</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-card border p-6 rounded-lg shadow-lg bg-white animate-pulse">
                <div className="skeleton-header"></div>
                <div className="mt-4">
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No appointments found.</p>
            <button className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300">
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out bg-white transform hover:scale-105"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={appointment.Doctor?.profilePicture || 'default-avatar.png'}
                    alt="Doctor Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xl font-semibold text-gray-800">{appointment.Doctor ? `${appointment.Doctor.firstName} ${appointment.Doctor.lastName}` : 'Unknown'}</p>
                    <p className="text-gray-500 text-sm">{appointment.Doctor?.specialty || 'Specialty not available'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-700">
                    <FaCalendarAlt className="mr-2 text-lg text-teal-500" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaClock className="mr-2 text-lg text-teal-500" />
                    <span>{appointment.StartTime} - {appointment.EndTime}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaUserMd className="mr-2 text-lg text-teal-500" />
                    <span>{appointment.appointmentType}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FaDollarSign className={`mr-2 text-lg ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-lg font-semibold ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                      {appointment.Payment ? appointment.Payment.paymentStatus : 'Not Paid'}
                    </span>
                  </div>
                </div>
                <div className="mt-6 flex justify-between items-center">
                  <button className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300">
                    Request Follow-Up
                  </button>
                  <span className="text-sm text-gray-500">{appointment.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default DisplayAppointment;
