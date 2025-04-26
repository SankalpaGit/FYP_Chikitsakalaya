import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaBriefcase, 
  FaDollarSign, 
  FaFileAlt, 
  FaMapMarkerAlt, 
  FaGlobe 
} from 'react-icons/fa';

// Configure axios base URL
axios.defaults.baseURL = 'http://localhost:5000/api';

const DoctorProfile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const navigate = useNavigate();
    const backendBaseUrl = 'http://localhost:5000'; // Base URL for file paths

    useEffect(() => {
        const fetchDoctorProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get('/doctor/view', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log('API Response:', response.data);

                if (response.data.success && response.data.doctor) {
                    setDoctorData(response.data.doctor);
                } else {
                    throw new Error('Invalid response data');
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching doctor profile:', error.response?.data || error.message);
                setError(error.response?.data?.message || 'Failed to load profile');
                setLoading(false);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    alert('Session expired. Please log in again.');
                    navigate('/login');
                }
            }
        };

        fetchDoctorProfile();
    }, [navigate]);

    useEffect(() => {
        // Show toaster for incomplete profile after 1.2 seconds
        if (doctorData && !doctorData.isComplete) {
            const toastTimer = setTimeout(() => {
                toast.warning(
                    <div className="flex items-center w-full justify-between">
                        <p className="text-yellow-700 font-medium">
                            Your profile is incomplete
                        </p>
                        <button
                            className="bg-teal-600 text-white  rounded-lg hover:bg-teal-700 transition duration-300"
                            onClick={() => navigate('/doctor/profile/edit')}
                        >
                            Complete
                        </button>
                    </div>,
                    {
                        autoClose: 5000,
                        closeOnClick: false,
                        pauseOnHover: true,
                        position: "top-right",
                        className: "shadow-lg rounded-lg",
                    }
                );
            }, 1200);

            return () => clearTimeout(toastTimer);
        }
    }, [doctorData, navigate]);

    // Handle Escape key to close modal
    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setShowModal(false);
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    if (loading) {
        return (
            <DoctorLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-600"></div>
                </div>
            </DoctorLayout>
        );
    }

    if (error) {
        return (
            <DoctorLayout>
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-600 text-lg font-medium">{error}</p>
                    <button
                        className="mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
                        onClick={() => navigate('/login')}
                    >
                        Log In Again
                    </button>
                </div>
            </DoctorLayout>
        );
    }

    if (!doctorData) {
        return (
            <DoctorLayout>
                <div className="container mx-auto px-4 py-8">
                    <p className="text-red-600 text-lg font-medium">No profile data available.</p>
                </div>
            </DoctorLayout>
        );
    }

    // Construct full URLs for profile picture and certificate
    const profilePictureUrl = doctorData.profilePicture 
        ? doctorData.profilePicture.startsWith('http') 
            ? doctorData.profilePicture 
            : `${backendBaseUrl}/${doctorData.profilePicture.replace(/\\/g, '/')}`
        : 'https://via.placeholder.com/200';

    const certificateUrl = doctorData.certificate 
        ? doctorData.certificate.startsWith('http') 
            ? doctorData.certificate 
            : `${backendBaseUrl}/${doctorData.certificate.replace(/\\/g, '/')}`
        : null;

    return (
        <DoctorLayout>
            <div className="container mx-auto px-4 py-2">
                {/* Toast Container */}
                <ToastContainer />

                {/* Profile Hero Card */}
                <div className="bg-gradient-to-r from-teal-500 to-teal-700 rounded-xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center md:items-start p-8">
                        <div className="relative">
                            <img
                                src={profilePictureUrl}
                                alt="Profile"
                                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-lg object-cover transform hover:scale-105 transition duration-300"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200'; }}
                            />
                        </div>
                        <div className="md:ml-8 mt-6 md:mt-0 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                Dr. {doctorData.firstName || 'N/A'} {doctorData.lastName || ''}
                            </h1>
                            <p className="text-lg text-teal-100 mt-2">
                                {doctorData.speciality || 'Speciality Not Specified'}
                            </p>
                            <p className="text-sm text-teal-200 mt-1">
                                License: {doctorData.licenseNumber || 'Not Provided'}
                            </p>
                            {certificateUrl ? (
                                <p className="text-sm text-teal-200 mt-1">
                                    Certificate: {' '}
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="underline hover:text-teal-100 transition duration-300 focus:outline-none"
                                    >
                                        View Certificate
                                    </button>
                                </p>
                            ) : (
                                <p className="text-sm text-teal-200 mt-1">
                                    Certificate: Not Provided
                                </p>
                            )}
                            <button
                                className="mt-6 bg-white text-teal-600 px-6 py-2 rounded-full font-medium hover:bg-teal-100 hover:text-teal-700 transition duration-300"
                                onClick={() => navigate('/doctor/profile/edit')}
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                {/* Certificate Modal */}
                {showModal && certificateUrl && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 p-6 relative">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
                                aria-label="Close modal"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Certificate</h3>
                            <div className="flex justify-center">
                                <img
                                    src={certificateUrl}
                                    alt="Certificate"
                                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                                <p className="text-red-600 hidden">
                                    Failed to load certificate image.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Profile Details */}
                <div className="mt-12 max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition duration-300">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                            <FaFileAlt className="w-6 h-6 text-teal-600 mr-2" />
                            Profile Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Professional Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">
                                    Professional
                                </h3>
                                <div className="flex items-center">
                                    <FaBriefcase className="w-5 h-5 text-teal-600 mr-3" />
                                    <p className="text-gray-700">
                                        <span className="font-medium">Experience:</span>{' '}
                                        {doctorData.experience ? `${doctorData.experience} years` : 'Not provided'}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <FaDollarSign className="w-5 h-5 text-teal-600 mr-3" />
                                    <p className="text-gray-700">
                                        <span className="font-medium">Consultation Fee:</span>{' '}
                                        {doctorData.consultationFee ? `$${doctorData.consultationFee}` : 'Not provided'}
                                    </p>
                                </div>
                            </div>
                            {/* Contact Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-gray-700 border-b border-gray-200 pb-2">
                                    Contact
                                </h3>
                                <div className="flex items-center">
                                    <FaMapMarkerAlt className="w-5 h-5 text-teal-600 mr-3" />
                                    <p className="text-gray-700">
                                        <span className="font-medium">State:</span>{' '}
                                        {doctorData.state || 'Not provided'}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <FaGlobe className="w-5 h-5 text-teal-600 mr-3" />
                                    <p className="text-gray-700">
                                        <span className="font-medium">Country:</span>{' '}
                                        {doctorData.country || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorProfile;