import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../layouts/DoctorLayout';

const DoctorProfile = () => {
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const popupTimer = setTimeout(() => {
            setShowPopup(true);
        }, 1200); // Show popup after 1.5s

        const closeTimer = setTimeout(() => {
            setShowPopup(false);
        }, 8000); // Hide popup after 8s

        return () => {
            clearTimeout(popupTimer);
            clearTimeout(closeTimer);
        };
    }, []);

    return (
        <DoctorLayout>
            <div>
                <p>This is the doctor profile</p>
            </div>
            {showPopup && (
                <div className="fixed top-20 right-4 flex items-center justify-center border rounded-md border-gray-200">
                    <div className="bg-white p-6 rounded-lg shadow-lg flex items-center space-x-6">
                        <p className="text-lg text-gray-600">Please complete your profile, doctor!</p>
                        <button
                            className="bg-teal-600 text-white px-3 py-3 rounded-lg text-lg"
                            onClick={() => navigate('/doctor/profile/edit')}
                        >
                            Edit Profile
                        </button>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
};

export default DoctorProfile;
