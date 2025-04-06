import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';
import { FaCalendarTimes, FaSearch, FaSync } from 'react-icons/fa'; // Using react-icons for icons

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, [token]);

  const fetchAppointments = async () => {
    if (!token) {
      console.error('No token found, user might be logged out.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/view/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Fetched appointments:', response.data);
      const paidAppointments = response.data.appointments.filter(
        (appt) => appt.Payment?.paymentStatus === 'paid'
      );
      setAppointments(paidAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
    }
  };

  // Handle checkbox toggle
  const handleCheckboxChange = (appointmentId) => {
    setSelectedAppointments((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  // Enhanced handler for marking as complete
  const handleMarkComplete = () => {
    if (selectedAppointments.length === 0) {
      alert('Please select at least one appointment to mark as complete.');
      return;
    }
    const confirm = window.confirm(
      `Are you sure you want to mark ${selectedAppointments.length} appointment(s) as complete?`
    );
    if (confirm) {
      console.log('Marking as complete:', selectedAppointments);
      alert(`Marked appointments as complete: ${selectedAppointments.join(', ')}`);
      // Static: Reset selection after "completing"
      setSelectedAppointments([]);
    }
  };

  // Static handler for delete
  const handleDelete = (appointmentId) => {
    const confirm = window.confirm(`Are you sure you want to delete appointment ${appointmentId}?`);
    if (confirm) {
      console.log('Deleting appointment:', appointmentId);
      alert(`Deleted appointment: ${appointmentId}`);
    }
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appt) =>
    `${appt.Patient?.firstName} ${appt.Patient?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <DoctorLayout>
      <div className="p-6 max-w-7xl mx-auto ">
        {/* Header with Search and Refresh */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-600">Appointments</h2>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={fetchAppointments}
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200 flex items-center"
            >
              <FaSync className="mr-2" /> Refresh
            </button>
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FaCalendarTimes className="text-8xl text-orange-600 mb-4 opacity-70" />
            <p className="text-lg font-medium">No appointments to display yet.</p>
            <p className="text-sm">Check back later or refresh the list!</p>
          </div>
        ) : (
          <div className="bg-white  overflow-hidden animate-fadeIn">
            {/* Action Button */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <button
                onClick={handleMarkComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                disabled={selectedAppointments.length === 0}
              >
                <span className="mr-2">✓</span> Mark as Complete
              </button>
              <span className="text-sm text-gray-600">
                {selectedAppointments.length} selected
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead className="bg-teal-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedAppointments(filteredAppointments.map((appt) => appt.id))
                            : setSelectedAppointments([])
                        }
                        checked={
                          selectedAppointments.length === filteredAppointments.length &&
                          filteredAppointments.length > 0
                        }
                        className="h-4 w-4  rounded-md "
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Payment Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr
                      key={appointment.id}
                      className="hover:bg-teal-50 transition duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAppointments.includes(appointment.id)}
                          onChange={() => handleCheckboxChange(appointment.id)}
                          className="h-4 w-4 text-teal-600 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {appointment.Patient?.firstName} {appointment.Patient?.lastName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{appointment.date}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {appointment.StartTime} - {appointment.EndTime}
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">
                        {appointment.appointmentType}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {appointment.description || 'No description'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {appointment.Payment?.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default AppointmentList;