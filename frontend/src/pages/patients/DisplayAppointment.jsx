import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaStethoscope, FaHospital, FaCalendarAlt, FaClock, FaUserMd, FaDollarSign
} from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import PatientLayout from '../../layouts/PatientLayout';

const DisplayAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        console.error('No token found.');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/view/appointments/patient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched appointments:', response.data.appointments);

        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error('Error fetching appointments:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const isUpcoming = (appointmentDate) => {
    return new Date(appointmentDate) >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchType = typeFilter === 'all' || appointment.appointmentType === typeFilter;
    const matchTime = timeFilter === 'upcoming' ? isUpcoming(appointment.date) : !isUpcoming(appointment.date);
    return matchType && matchTime;
  });

  return (
    <PatientLayout>
      <div className="w-11/12 mx-auto py-5 mb-5">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
          {/* Tabs */}
          <div className="flex space-x-2 bg-gray-100 w-2/12">
            {['all', 'physical', 'online'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-md transition duration-200 ${typeFilter === type
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Dropdown */}
          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="upcoming">Upcoming</option>
              <option value="previous">Previous</option>
            </select>
            <div className="absolute right-2 top-3 pointer-events-none text-gray-500">
              <IoIosArrowDown />
            </div>
          </div>
        </div>

        {/* Appointment Cards */}
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No appointments found.</p>
            <button className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors duration-300">
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAppointments.map((appointment) => {
              const doctor = appointment.Doctor;
              const details = doctor?.doctorDetails?.[0] || {};
              const profilePic = details.profilePicture
                ? `http://localhost:5000/${details.profilePicture.replace(/\\/g, '/')}`
                : 'default-avatar.png';

              const isPrevious = !isUpcoming(appointment.date);
              const isOnline = appointment.appointmentType === 'online';

              return (
                <div key={appointment.id} className="flex bg-white border rounded-2xl shadow-md p-4 items-center w-10/12 mx-auto">
                  {/* Left - Doctor Image */}
                  <div className="w-1/6 flex justify-center">
                    <img
                      src={profilePic}
                      alt="Doctor"
                      className="w-40 h-40  rounded-md border-2 border-teal-500 object-cover"
                    />
                  </div>

                  {/* Center - Details */}
                  <div className="w-3/5 px-4 space-y-1 ml-5">
                    <div className='mb-5'>
                      <p className="text-2xl font-bold text-gray-600">
                        Dr. {doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown'}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <FaStethoscope className="text-teal-500" />
                        <span>{details.speciality || 'Specialty not available'}</span>
                        <span>|</span>
                        <FaHospital className="text-teal-500" />
                        <span>{appointment.hospitalAffiliation || 'Hospital not available'}</span>
                        <span>|</span>
                        <div className="flex items-center text-sm">
                          <span
                            className={`mr-1 text-lg font-bold ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-500' : 'text-red-500'
                              }`}>
                            रु
                          </span>
                          <span
                            className={`font-semibold ${appointment.Payment?.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'
                              }`}
                          >
                            {appointment.Payment?.paymentStatus || 'Not Paid'}
                          </span>
                        </div>
                      </div>
                    </div>


                    <div className="text-md text-gray-600 ">
                      <div className="flex items-center mb-2 gap-2">
                        <FaCalendarAlt className="mr-1 text-2xl text-teal-500" />
                        <span>
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-2 gap-2">
                        <FaClock className="mr-1 text-2xl text-teal-500" />
                        <span>
                          {new Date(`${appointment.date}T${appointment.StartTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })} - {new Date(`${appointment.date}T${appointment.EndTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-2 gap-2">
                        <FaUserMd className="mr-1 text-2xl text-teal-500" />
                        <span>{appointment.appointmentType}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
<div className="w-1/5 flex flex-col space-y-2 items-end">
  {appointment.Payment?.paymentStatus === 'paid' ? (
    <>
      {isPrevious ? (
        <button className="px-4 mb-28 py-3 w-8/12 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition">
          Follow-Up
        </button>
      ) : (
        <button className="px-4 mb-28 py-3 w-8/12 bg-red-600 text-white rounded-md hover:bg-red-700 transition">
          Cancel
        </button>
      )}

      {isOnline && (
        <button
          className={`px-4 py-2 w-full rounded-md transition ${
            isPrevious
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
          disabled={isPrevious}
        >
          Join Consultation
        </button>
      )}
    </>
  ) : (
    <a href={`/payment/${appointment.id}`} className="w-full">
      <button className="px-4 py-2 w-full bg-red-500 text-white rounded-md hover:bg-red-600 transition">
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
