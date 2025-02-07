import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaMale, FaBirthdayCake, FaEdit, FaCamera } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';

const PatientProfile = () => {
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [patient, setPatient] = useState(null);
    const [profileImage, setProfileImage] = useState("https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp");
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        gender: '',
        dateOfBirth: '',
        profileImage: null
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getProfile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.data.success) {
                    setPatient(response.data.patient);
                    setIsProfileComplete(response.data.patient.isProfileComplete);
                    setProfileImage(response.data.patient.profileImage || profileImage);
                    setFormData(response.data.patient);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result);
                setFormData({ ...formData, profileImage: file });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileUpdate = async () => {
        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.put('http://localhost:5000/api/updateProfile', formDataToSend, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setPatient(response.data.patient);
                setIsProfileComplete(response.data.patient.isProfileComplete);
                setProfileImage(response.data.patient.profileImage);
                setShowModal(false);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <PatientLayout>
            {/* Profile Completion Popup */}
            {showPopup && !isProfileComplete && (
                <div className="fixed top-24 right-5 bg-white text-gray-600 p-4 rounded-md shadow-lg border border-gray-300 w-80">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Your profile is incomplete!</p>
                        <RxCross2 className="cursor-pointer text-xl text-gray-600" onClick={() => setShowPopup(false)} />
                    </div>
                    <button className="mt-3 bg-teal-600 text-white px-4 py-2 rounded-md w-full font-semibold" onClick={() => setShowModal(true)}>Complete Now</button>
                </div>
            )}

            {/* Profile Card */}
            <div className="flex flex-col lg:flex-row p-6 gap-6 mt-10 items-stretch">
                <div className="w-full lg:w-5/12">
                    <div className="flex justify-between mb-4 bg-white shadow-md rounded-md p-6 border border-gray-300">
                        <div className="relative w-36 h-40 bg-gray-200 rounded-md">
                            <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-md" />
                            <label className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer">
                                <FaCamera className="text-gray-600" />
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                            </label>
                        </div>
                        <div className="flex flex-col justify-center w-8/12 space-y-2">
                            <div className='flex items-center justify-between'>
                                <h1 className="text-xl font-bold">{patient?.firstName} {patient?.lastName}</h1>
                                <FaEdit className="text-gray-600 cursor-pointer" onClick={() => setShowModal(true)} />
                            </div>
                            <p className="flex items-center text-gray-600"><FaEnvelope className="mr-2" /> {patient?.email}</p>
                            <p className="flex items-center text-gray-600"><FaMapMarkerAlt className="mr-2" /> {patient?.address || 'N/A'}</p>
                            <p className="flex items-center text-gray-600"><FaPhoneAlt className="mr-2" /> {patient?.phone || 'N/A'}</p>
                            <div className="flex justify-between w-8/12">
                                <p className="flex items-center text-gray-600"><FaMale className="mr-2" /> {patient?.gender || 'N/A'}</p>
                                <p className="flex items-center text-gray-600"><FaBirthdayCake className="mr-2" /> {patient?.dateOfBirth || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                        <input 
                            type="text" 
                            placeholder="First Name" 
                            value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
                            className="w-full mb-2 p-2 border rounded focus:ring-teal-600 focus:ring-2 focus:outline-none focus:text-teal-600 focus:font-semibold" 
                        />
                        <input 
                            type="text" 
                            placeholder="Last Name" 
                            value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} 
                            className="w-full mb-2 p-2 border rounded focus:ring-teal-600 focus:ring-2 focus:outline-none focus:text-teal-600 focus:font-semibold" 
                        />
                        <input 
                            type="text" 
                            value={formData.email} 
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                            className="w-full mb-2 p-2 border rounded focus:ring-teal-600 focus:ring-2 focus:outline-none focus:text-teal-600 focus:font-semibold" 
                        />
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full mb-2 p-2 border rounded focus:ring-teal-600 focus:ring-2 focus:outline-none focus:text-teal-600 focus:font-semibold placeholder:text-gray-800 "
                            placeholder="Phone Number"
                            
                        />
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full mb-2 p-2 border rounded focus:ring-teal-600 focus:ring-2 focus:outline-none focus:text-teal-600 focus:font-semibold"
                            placeholder="Address"
                        />

                        <input type="date" value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="w-full mb-2 p-2 border rounded" />
                        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full mb-2 p-2 border rounded">
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        <button className="w-full bg-teal-600 text-white p-2 rounded" onClick={handleProfileUpdate}>Save Changes</button>
                        <button className="w-full bg-red-600 text-white p-2 rounded mt-2" onClick={() => setShowModal(false)}>Close</button>
                    </div>
                </div>
            )}
        </PatientLayout>
    );
};

export default PatientProfile;
