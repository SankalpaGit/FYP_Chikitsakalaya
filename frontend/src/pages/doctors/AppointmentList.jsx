import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';
import { FaCalendarTimes, FaSearch, FaSync, FaUserMd, FaClock, FaCalendarAlt } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'react-toastify';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchAppointments();
  }, [token, typeFilter, timeFilter]);

  const fetchAppointments = async () => {
    if (!token) {
      console.error('No token found, user might be logged out.');
      toast.error('Please log in to view appointments.', { autoClose: 3000 });
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/view/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const paidAppointments = response.data.appointments.filter(
        (appt) => appt.Payment?.paymentStatus === 'paid'
      );
      setAppointments(paidAppointments);

      // Fetch meeting links for online appointments
      const onlineAppointments = paidAppointments.filter(
        (app) => app.appointmentType === 'online' && isUpcoming(app.date)
      );
      const meetingLinkPromises = onlineAppointments.map(async (app) => {
        try {
          const meetingResponse = await axios.get(
            `http://localhost:5000/api/get-meeting-link/${app.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const meetingLink = meetingResponse.data.data?.meetingLink || meetingResponse.data.meetingLink || null;
          console.log(`Meeting link for appointment ${app.id}:`, meetingLink);
          return { id: app.id, meetingLink };
        } catch (error) {
          console.error(`Error fetching meeting link for appointment ${app.id}:`, error.response?.data || error.message);
          return { id: app.id, meetingLink: null };
        }
      });

      const meetingLinksData = await Promise.all(meetingLinkPromises);
      const meetingLinksMap = meetingLinksData.reduce((acc, { id, meetingLink }) => ({
        ...acc,
        [id]: meetingLink
      }), {});
      setMeetingLinks(meetingLinksMap);
      console.log('Meeting Links Map:', meetingLinksMap);
    } catch (error) {
      console.error('Error fetching appointments:', error.response?.data || error.message);
      toast.error('Failed to fetch appointments.', { autoClose: 3000 });
    }
  };

  const isUpcoming = (appointmentDate) => {
    return new Date(appointmentDate) >= new Date(new Date().setHours(0, 0, 0, 0));
  };

  const handleCheckboxChange = (appointmentId) => {
    setSelectedAppointments((prev) =>
      prev.includes(appointmentId)
        ? prev.filter((id) => id !== appointmentId)
        : [...prev, appointmentId]
    );
  };

  const markAppointmentsAsComplete = async () => {
    try {
      await Promise.all(
        selectedAppointments.map(async (appointmentId) => {
          await axios.post(
            'http://localhost:5000/api/appointment/complete',
            { appointmentId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        })
      );
      toast.success('Appointments marked as complete.', { autoClose: 3000 });
      fetchAppointments();
      setSelectedAppointments([]);
    } catch (error) {
      console.error('Error marking complete:', error.response?.data || error.message);
      toast.error('Failed to mark appointments as complete.', { autoClose: 3000 });
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      await axios.delete('http://localhost:5000/api/appointment/delete', {
        data: { appointmentId },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Appointment deleted.', { autoClose: 3000 });
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting:', error.response?.data || error.message);
      toast.error('Failed to delete appointment.', { autoClose: 3000 });
    }
  };

  const handleMarkComplete = () => {
    if (selectedAppointments.length === 0) {
      toast.warn('Please select at least one appointment to mark as complete.', { autoClose: 3000 });
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to mark ${selectedAppointments.length} appointment(s) as complete?`
    );
    if (confirm) {
      markAppointmentsAsComplete();
    }
  };

  const handleDelete = (appointmentId) => {
    const confirm = window.confirm(`Are you sure you want to delete appointment ${appointmentId}?`);
    if (confirm) {
      deleteAppointment(appointmentId);
    }
  };

  const handleJoinConsultation = (appointmentId) => {
    const meetingLink = meetingLinks[appointmentId];
    if (meetingLink) {
      console.log(`Opening meeting link for appointment ${appointmentId}: ${meetingLink}`);
      window.open(meetingLink, '_blank', 'noopener,noreferrer');
    } else {
      console.error(`No meeting link found for appointment ${appointmentId}`);
      toast.error('Meeting link not available. Please contact support.', { autoClose: 3000 });
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const matchName = `${appt.Patient?.firstName} ${appt.Patient?.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' || appt.appointmentType === typeFilter;
    const matchTime = timeFilter === 'upcoming' ? isUpcoming(appt.date) : !isUpcoming(appt.date);
    return matchName && matchType && matchTime;
  });

  return (
    <DoctorLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header with Tabs, Dropdown, Search, and Refresh */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-600">Appointments</h2>
          <div className="flex space-x-4 items-center">
            {/* Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-md">
              {['all', 'physical', 'online'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-4 py-2 rounded-md transition duration-200 ${
                    typeFilter === type
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

            {/* Search */}
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

          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FaCalendarTimes className="text-8xl text-orange-600 mb-4 opacity-70" />
            <p className="text-lg font-medium">No appointments to display yet.</p>
            <p className="text-sm">Check back later or refresh the list!</p>
          </div>
        ) : (
          <div className="bg-white overflow-hidden animate-fadeIn">
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
                        className="h-4 w-4 rounded-md"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Payment Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => {
                    const isPrevious = !isUpcoming(appointment.date);
                    const isOnline = appointment.appointmentType === 'online';

                    return (
                      <tr key={appointment.id} className="hover:bg-teal-50 transition duration-150">
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
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(`${appointment.date}T${appointment.StartTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })} -{' '}
                          {new Date(`${appointment.date}T${appointment.EndTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </td>
                        <td className="px-6 py-4 text-gray-600 capitalize">{appointment.appointmentType}</td>
                        <td className="px-6 py-4 text-gray-600">{appointment.description || 'No description'}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {appointment.Payment?.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex space-x-2">
                          {isOnline && !isPrevious && (
                            <button
                              onClick={() => handleJoinConsultation(appointment.id)}
                              className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition duration-200"
                            >
                              Join
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(appointment.id)}
                            className="text-red-600 hover:text-red-800 font-medium transition duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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