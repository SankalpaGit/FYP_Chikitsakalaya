import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FaStethoscope, FaHospital, FaCalendarAlt, FaClock, FaUserMd
} from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'react-toastify';
import PatientLayout from '../../layouts/PatientLayout';

const DisplayAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [meetingLinks, setMeetingLinks] = useState({});
  const [followUpCounts, setFollowUpCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({
    requestedDate: '',
    requestedStartTime: '',
    requestedEndTime: '',
    appointmentType: 'online',
    hospitalAffiliation: '',
    requestDescription: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!token) {
        console.error('No token found.');
        toast.error('Please log in to view appointments.', { autoClose: 3000 });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/view/appointments/patient', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Fetched appointments:', response.data.appointments);

        const appointmentsData = response.data.appointments || [];
        setAppointments(appointmentsData);

        // Fetch follow-up counts for previous appointments
        const previousAppointments = appointmentsData.filter(app => !isUpcoming(app.date, app.EndTime));
        const followUpCountPromises = previousAppointments.map(async (app) => {
          try {
            const countResponse = await axios.get(
              `http://localhost:5000/api/appointments/${app.id}/followups/count`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { id: app.id, count: countResponse.data.count };
          } catch (error) {
            console.error(`Error fetching follow-up count for appointment ${app.id}:`, error.response?.data || error.message);
            return { id: app.id, count: 0 };
          }
        });

        const followUpCountsData = await Promise.all(followUpCountPromises);
        const followUpCountsMap = followUpCountsData.reduce((acc, { id, count }) => ({
          ...acc,
          [id]: count,
        }), {});
        setFollowUpCounts(followUpCountsMap);
        console.log('Follow-Up Counts Map:', followUpCountsMap);

        // Fetch meeting links for online appointments
        const onlineAppointments = appointmentsData.filter(app => app.appointmentType === 'online' && isUpcoming(app.date, app.EndTime));
        const meetingLinkPromises = onlineAppointments.map(async (app) => {
          try {
            const meetingResponse = await axios.get(
              `http://localhost:5000/api/get-meeting-link/${app.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            return { id: app.id, meetingLink: meetingResponse.data.data?.meetingLink || meetingResponse.data.meetingLink || null };
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
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [token]);

  const isUpcoming = (appointmentDate, endTime) => {
    const now = new Date();
    const appointmentEnd = new Date(`${appointmentDate}T${endTime}`);
    return appointmentEnd >= now;
  };

  const isToday = (appointmentDate) => {
    const today = new Date();
    const appointment = new Date(appointmentDate);
    return (
      appointment.getDate() === today.getDate() &&
      appointment.getMonth() === today.getMonth() &&
      appointment.getFullYear() === today.getFullYear()
    );
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/appointment/cancel',
        { appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Cancel response:', response.data);
      toast.success('Appointment cancelled successfully!', { autoClose: 3000 });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === appointmentId ? { ...app, isCancelled: true } : app
        )
      );
    } catch (error) {
      console.error('Error cancelling appointment:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to cancel appointment.', { autoClose: 3000 });
    }
  };

  const handleFollowUpClick = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      requestedDate: '',
      requestedStartTime: '',
      requestedEndTime: '',
      appointmentType: 'online',
      hospitalAffiliation: '',
      requestDescription: '',
    });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    // Client-side validation
    if (!formData.requestedDate || !formData.requestedStartTime || !formData.requestedEndTime || !formData.appointmentType) {
      toast.error('Please fill in all required fields.', { autoClose: 3000 });
      return;
    }
    if (formData.appointmentType === 'physical' && !formData.hospitalAffiliation) {
      toast.error('Hospital affiliation is required for physical appointments.', { autoClose: 3000 });
      return;
    }

    setFormLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/appointments/${selectedAppointment.id}/followup`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Follow-up request response:', response.data);
      toast.success('Follow-up request sent successfully!', { autoClose: 3000 });
      handleModalClose();
    } catch (error) {
      console.error('Error submitting follow-up request:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to send follow-up request.', { autoClose: 3000 });
    } finally {
      setFormLoading(false);
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

  const filteredAppointments = appointments.filter((appointment) => {
    const matchType = typeFilter === 'all' || appointment.appointmentType === typeFilter;
    const matchTime = timeFilter === 'upcoming' ? isUpcoming(appointment.date, appointment.EndTime) : !isUpcoming(appointment.date, appointment.EndTime);
    return matchType && matchTime && !appointment.isCancelled;
  });

  return (
    <PatientLayout>
      <div className="w-11/12 mx-auto py-5 mb-5">
        {/* Filters */}
        <div className="flex justify-between items-center mb-6">
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

              const isPrevious = !isUpcoming(appointment.date, appointment.EndTime);
              const isOnline = appointment.appointmentType === 'online';
              const isAppointmentToday = isToday(appointment.date);
              const canRequestFollowUp = followUpCounts[appointment.id] < 2;

              return (
                <div key={appointment.id} className="flex bg-white border rounded-2xl shadow-md p-4 items-center w-10/12 mx-auto">
                  {/* Left - Doctor Image */}
                  <div className="w-1/6 flex justify-center">
                    <img
                      src={profilePic}
                      alt="Doctor"
                      className="w-40 h-40 rounded-md border-2 border-teal-500 object-cover"
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

                    <div className="text-md text-gray-600">
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
                          <button
                            onClick={() => handleFollowUpClick(appointment)}
                            disabled={!canRequestFollowUp}
                            className={`px-4 mb-28 py-3 w-8/12 rounded-md transition ${canRequestFollowUp
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              }`}
                          >
                            Follow-Up
                          </button>
                        ) : (
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            disabled={isAppointmentToday}
                            className={`px-4 mb-28 py-3 w-8/12 rounded-md transition ${isAppointmentToday
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                          >
                            Cancel
                          </button>
                        )}

                        {isOnline && (
                          <button
                            onClick={() => handleJoinConsultation(appointment.id)}
                            className={`px-4 py-2 w-full rounded-md transition ${isPrevious
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

      {/* Follow-Up Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Request Follow-Up</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  name="requestedDate"
                  value={formData.requestedDate}
                  onChange={handleFormChange}
                  min={new Date().toISOString().split('T')[0]} // Prevent past dates
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  name="requestedStartTime"
                  value={formData.requestedStartTime}
                  onChange={handleFormChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  name="requestedEndTime"
                  value={formData.requestedEndTime}
                  onChange={handleFormChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Appointment Type</label>
                <select
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleFormChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                  required
                >
                  <option value="online">Online</option>
                  <option value="physical">Physical</option>
                </select>
              </div>
              {formData.appointmentType === 'physical' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hospital Affiliation</label>
                  <input
                    type="text"
                    name="hospitalAffiliation"
                    value={formData.hospitalAffiliation}
                    onChange={handleFormChange}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                <textarea
                  name="requestDescription"
                  value={formData.requestDescription}
                  onChange={handleFormChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                  rows="4"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className={`px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition ${formLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {formLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PatientLayout>
  );
};

export default DisplayAppointment;