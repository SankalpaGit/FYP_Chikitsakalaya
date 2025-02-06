import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaMale, FaBirthdayCake, FaEdit } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';

const PatientProfile = () => {
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/getProfile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Profile:', response.data);
                
                if (response.data.success) {
                    setIsProfileComplete(response.data.patient.isProfileComplete);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!isProfileComplete) {
            setTimeout(() => {
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 10000); // Close popup after 10 seconds
            }, 1500); // Show popup after 1.5 seconds
        }
    }, [isProfileComplete]);

    return (
        <PatientLayout>
            {/* Profile Completion Popup */}
            {showPopup && (
                <div className="fixed top-24 right-5 bg-white text-gray-600 p-4 rounded-md shadow-lg border border-gray-300 w-80">
                    <div className="flex justify-between items-center">
                        <p className="font-semibold">Your profile is incomplete!</p>
                        <RxCross2 className="cursor-pointer text-xl text-gray-600" onClick={() => setShowPopup(false)} />
                    </div>
                    <button
                        className="mt-3 bg-teal-600 text-white px-4 py-2 rounded-md w-full font-semibold"
                        onClick={() => console.log('Complete Now')}
                    >
                        Complete Now
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row p-6 gap-6 mt-10 items-stretch">
                <div className="w-full lg:w-5/12">
                    <div className="flex justify-between mb-4 bg-white shadow-md rounded-md p-6 border border-gray-300">
                        <div className="w-36 h-40 bg-gray-200 rounded-md">
                            <img src="https://cdn3d.iconscout.com/3d/premium/thumb/boy-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--boys-male-man-pack-avatars-icons-5187865.png?f=webp" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center w-8/12 space-y-2">
                            <div className='flex items-center justify-between'>
                                <h1 className="text-xl font-bold">Sankalpa Shrestha</h1>
                                <FaEdit className="text-gray-600" />
                            </div>
                            <p className="flex items-center text-gray-600">
                                <FaEnvelope className="mr-2" /> joshisankalpa@gmail.com
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-2" /> Ramdhuni 05- Jhumka
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaPhoneAlt className="mr-2" /> 980258877
                            </p>
                            <div className="flex justify-between w-8/12">
                                <p className="flex items-center text-gray-600">
                                    <FaMale className="mr-2" /> Male
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <FaBirthdayCake className="mr-2" /> 2003-06-22
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientProfile;
