import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserMd, FaCalendarAlt, FaClock, FaDollarSign, FaHospital, FaStethoscope } from 'react-icons/fa';
import PatientLayout from '../../layouts/PatientLayout';

const DisplayAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('physical'); // State for tab selection
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

  // Filter the appointments based on the selected filter
  const filteredAppointments = appointments.filter((appointment) => {
    if (filter === 'online') {
      return appointment.appointmentType === 'online';
    }
    if (filter === 'physical') {
      return appointment.appointmentType === 'physical';
    }
    return true; // 'all' filter, shows all appointments
  });

  return (
    <PatientLayout>
      <div className="w-10/12 m-auto  py-5 mb-5">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Your Appointments</h2>
          <div className="flex space-x-4">
            
            <button
              className={`px-4 py-2 rounded-md text-sm ${filter === 'physical' ? 'bg-teal-600 text-white' : 'text-teal-600'}`}
              onClick={() => setFilter('physical')}
            >
              Physical
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm ${filter === 'online' ? 'bg-teal-600 text-white' : 'text-teal-600'}`}
              onClick={() => setFilter('online')}
            >
              Online
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="skeleton-card border p-6 rounded-2xl shadow-lg bg-white animate-pulse">
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
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No appointments found.</p>
            <button className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300">
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAppointments.map((appointment) => {
              const doctorDetails = appointment.Doctor?.doctorDetails || [];
              const profilePicture = doctorDetails.find(detail => detail.profilePicture)?.profilePicture || 'default-avatar.png';
              const profileImageUrl = `http://localhost:5000/${profilePicture.replace(/\\/g, '/')}`;
              const speciality = doctorDetails[0]?.speciality || 'Specialty not available';
              const hospitalAffiliation = doctorDetails[0]?.hospitalAffiliation || 'Hospital not available';

              return (
                <div
                  key={appointment.id}
                  className="h-fit border p-6 rounded-2xl shadow-md bg-white"
                >
                  {/* 1st Div: Centralized Image */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={profileImageUrl}
                      alt="Doctor Profile"
                      className="w-28 h-28 rounded-lg object-cover"
                    />
                  </div>

                  {/* 2nd Div: Doctor Info */}
                  <div className="text-center mb-4">
                    <p className="text-xl font-semibold text-gray-800">
                      {appointment.Doctor ? `${appointment.Doctor.firstName} ${appointment.Doctor.lastName}` : 'Unknown'}
                    </p>
                    <p className="text-gray-500 text-sm flex justify-center items-center space-x-2">
                      <FaStethoscope className="text-teal-500" />
                      <span>{speciality}</span>
                      <span className="text-gray-400">|</span>
                      <FaHospital className="text-teal-500" />
                      <span>{hospitalAffiliation}</span>
                    </p>
                  </div>

                  {/* 3rd Div: Appointment Details */}
                  <div className="space-y-1 mb-4 text-sm text-gray-700">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-teal-500" />
                        <span>{appointment.date}</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-teal-500" />
                        <span>{appointment.StartTime} - {appointment.EndTime}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <FaUserMd className="mr-2 text-teal-500" />
                        <span>{appointment.appointmentType}</span>
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className={`mr-2 text-lg ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`} />
                        <span className={`text-lg font-semibold ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'}`}>
                          {appointment.Payment ? appointment.Payment.paymentStatus : 'Not Paid'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4th Div: Buttons */}
                  <div className="mt-6 space-y-4">
                    {appointment.Payment?.paymentStatus === 'paid' ? (
                      <>
                        <button className="w-full px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300">
                          Request Follow-Up
                        </button>
                        {appointment.appointmentType === 'online' && (
                          <button className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300">
                            Join Consultation
                          </button>
                        )}
                      </>
                    ) : (
                      <a href={`/payment/${appointment.id}`}>
                        <button className="w-full px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300">
                          Pay Fee
                        </button>
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

export default DisplayAppointment;
