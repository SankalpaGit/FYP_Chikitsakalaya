import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import PatientLayout from '../../layouts/PatientLayout'; // Adjust path if needed

const PatientFollowUpPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!token) {
        toast.error('Please log in to view follow-up requests.', { autoClose: 3000 });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/patient', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Follow-up requests:', response.data.data);
        setFollowUps(response.data.data || []);
      } catch (error) {
        console.error('Error fetching follow-up requests:', error);
        toast.error('Failed to load follow-up requests.', { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [token]);

  return (
    <PatientLayout>
      <div className="w-11/12 mx-auto py-5 mb-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Follow-Up Requests</h1>

        {loading ? (
          <div className="text-center text-lg text-gray-500 py-10">Loading follow-ups...</div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No follow-up requests found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {followUps.map((followUp, index) => {
              const doctorName = followUp?.Appointment?.Doctor
                ? `Dr. ${followUp.Appointment.Doctor.firstName} ${followUp.Appointment.Doctor.lastName}`
                : 'Doctor Info Not Available';

              return (
                <div
                  key={index}
                  className="flex bg-white border rounded-2xl shadow-md p-4 items-center w-10/12 mx-auto"
                >
                  <div className="w-4/5 px-4 space-y-1 ml-5">
                    <div className="mb-5">
                      <p className="text-2xl font-bold text-gray-700">{doctorName}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>
                          Status:{' '}
                          <span
                            className={`font-semibold ${
                              followUp.status === 'pending'
                                ? 'text-yellow-600'
                                : followUp.status === 'approved'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {followUp.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="text-md text-gray-600 space-y-2">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-2xl text-teal-500" />
                        <span>
                          {new Date(followUp.requestedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaClock className="text-2xl text-teal-500" />
                        <span>
                          {new Date(`1970-01-01T${followUp.requestedStartTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}{' '}
                          -{' '}
                          {new Date(`1970-01-01T${followUp.requestedEndTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <FaUserMd className="text-2xl text-teal-500" />
                        <span className="capitalize">{followUp.followUPType}</span>
                      </div>

                      {followUp.requestDescription && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">
                            <strong>Description:</strong> {followUp.requestDescription}
                          </p>
                        </div>
                      )}

                      {followUp.responseMessage && followUp.status === 'rejected' && (
                        <div className="mt-2">
                          <p className="text-sm text-red-600">
                            <strong>Rejection Reason:</strong> {followUp.responseMessage}
                          </p>
                        </div>
                      )}
                    </div>
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

export default PatientFollowUpPage;
