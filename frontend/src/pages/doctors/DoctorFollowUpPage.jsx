import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendarAlt, FaClock, FaUserMd } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DoctorLayout from '../../layouts/DoctorLayout'; // Adjust path to your DoctorLayout

const DoctorFollowUpPage = () => {
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState({ open: false, followUpId: null });
  const [acceptModal, setAcceptModal] = useState({ open: false, followUpId: null });
  const [responseMessage, setResponseMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchFollowUps = async () => {
      if (!token) {
        toast.error('Please log in to view follow-up requests.', { autoClose: 3000 });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/doctor', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Follow-up requests:', response.data.data);
        
        setFollowUps(response.data.data || []);
      } catch (error) {
        console.error('Error fetching follow-up requests:', error.response?.data || error.message);
        toast.error('Failed to fetch follow-up requests.', { autoClose: 3000 });
      } finally {
        setLoading(false);
      }
    };

    fetchFollowUps();
  }, [token]);

  const confirmAccept = async () => {
    if (!acceptModal.followUpId) return;

    try {
      await axios.post(
        `http://localhost:5000/api/followups/${acceptModal.followUpId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Follow-up request accepted successfully!', { autoClose: 3000 });
      setFollowUps((prev) =>
        prev.map((fu) => (fu.id === acceptModal.followUpId ? { ...fu, status: 'approved', responseMessage: null } : fu))
      );
      setAcceptModal({ open: false, followUpId: null });
    } catch (error) {
      console.error('Error accepting follow-up:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to accept follow-up request.', { autoClose: 3000 });
      setAcceptModal({ open: false, followUpId: null });
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectModal.followUpId) return;
  
    try {
      await axios.post(
        `http://localhost:5000/api/followups/${rejectModal.followUpId}/reject`,
        { responseMessage: responseMessage || 'Follow-up request rejected.' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Follow-up request rejected successfully!', { autoClose: 3000 });
      setFollowUps((prev) =>
        prev.map((fu) =>
          fu.id === rejectModal.followUpId
            ? { ...fu, status: 'rejected', responseMessage: responseMessage || 'Follow-up request rejected.' }
            : fu
        )
      );
      setRejectModal({ open: false, followUpId: null });
      setResponseMessage('');
    } catch (error) {
      console.error('Error rejecting follow-up:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to reject follow-up request.', { autoClose: 3000 });
    }
  };

  const openRejectModal = (followUpId) => {
    setRejectModal({ open: true, followUpId });
    setResponseMessage('');
  };

  const closeRejectModal = () => {
    setRejectModal({ open: false, followUpId: null });
    setResponseMessage('');
  };

  return (
    <DoctorLayout>
      <div className="w-11/12 mx-auto py-5 mb-5">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Follow-Up Requests</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : followUps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No follow-up requests found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {followUps.map((followUp) => {
              const appointment = followUp.Appointment || {};
              const patient = appointment.Patient || {};
              return (
                <div
                  key={followUp.id}
                  className="flex bg-white border rounded-2xl shadow-md p-4 items-center w-10/12 mx-auto"
                >
                  {/* Left - Patient Info */}
                  <div className="w-3/5 px-4 space-y-1 ml-5">
                    <div className="mb-5">
                      <p className="text-2xl font-bold text-gray-600">
                        {patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient'}
                      </p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <FaUserMd className="text-teal-500" />
                        <span>{followUp.followUPType}</span>
                        <span>|</span>
                        <span>Status: <span className={`font-semibold ${followUp.status === 'pending' ? 'text-yellow-600' : followUp.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>{followUp.status}</span></span>
                      </div>
                    </div>
                    <div className="text-md text-gray-600">
                      <div className="flex items-center mb-2 gap-2">
                        <FaCalendarAlt className="mr-1 text-2xl text-teal-500" />
                        <span>
                          {new Date(followUp.requestedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center mb-2 gap-2">
                        <FaClock className="mr-1 text-2xl text-teal-500" />
                        <span>
                          {new Date(`1970-01-01T${followUp.requestedStartTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })} -{' '}
                          {new Date(`1970-01-01T${followUp.requestedEndTime}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
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

                  {/* Right - Actions */}
                  <div className="w-1/5 flex flex-col space-y-2 items-end">
                    {followUp.status === 'pending' && (
                      <>
                        <button
                          onClick={() => setAcceptModal({ open: true, followUpId: followUp.id })}
                          className="px-4 py-2 w-8/12 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => openRejectModal(followUp.id)}
                          className="px-4 py-2 w-8/12 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reject Follow-Up Request</h2>
              <form onSubmit={handleReject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Rejection Reason</label>
                  <textarea
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-teal-500 focus:border-teal-500"
                    rows="4"
                    placeholder="Enter reason for rejection (optional)"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={closeRejectModal}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Accept Confirmation Modal */}
        {acceptModal.open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Accept Follow-Up Request</h2>
              <p className="mb-6 text-gray-600">Are you sure you want to accept this follow-up request?</p>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAcceptModal({ open: false, followUpId: null })}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmAccept}
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorFollowUpPage;
