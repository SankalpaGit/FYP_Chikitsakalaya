import React, { useState } from 'react';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';
import ProfileModel from '../modals/ProfileModel'; // Adjust the path as necessary
import NotificationModel from '../modals/NotificationModel'; // Adjust the path as necessary

const DoctorNavbar = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const notifications = [
        { message: 'New appointment request from Dr. Smith', time: '2 minutes ago' },
        { message: 'Your profile has been updated', time: '5 minutes ago' },
        { message: 'New Doctor Approval request', time: '5 minutes ago' },
        { message: 'Dr smit break the community starndards', time: '5 minutes ago' },
    ]; // Replace this with actual notification data

    const toggleProfilePopup = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const toggleNotificationPopup = () => {
        setIsNotificationOpen(!isNotificationOpen);
    };

    const handleEdit = () => {
        console.log('Edit Profile Clicked');
    };

    const handleLogout = () => {
        console.log('Logout Clicked');
    };

    return (
        <div className="flex justify-between items-center bg-custom-bg p-4 shadow-md fixed w-full z-50">
           <img src="/projects/naming.png" alt="" className='w-40'/>

            {/* Right Section: Notification and Profile */}
            <div className="flex  w-72 space-x-24 items-center">
            
             <FaBell className="text-teal-700 hover:text-teal-600 text-3xl cursor-pointer" />

                {/* Profile Section */}
                <div className="relative">
                    <FaUserCircle
                        className="text-4xl text-gray-600 cursor-pointer"
                        onClick={toggleProfilePopup}
                    />
                    <ProfileModel
                        isOpen={isProfileOpen}
                        onClose={toggleProfilePopup}
                        profileImage="https://img.freepik.com/free-psd/3d-render-female-doctor-wearing-glasses-white-coat-stethoscope-around-her-neck-she-has-dark-hair-friendly-expression_632498-32065.jpg?t=st=1739009508~exp=1739013108~hmac=4e40512c23e5649a8bf41c898d1eb3483f05b5ed01bba633fdd16cc61aea3a65&w=740"
                        name="Dr. Himani Ghimire"
                        gmail="himani.ghimire@gmail.com"
                        onEdit={handleEdit}
                        onLogout={handleLogout}
                    />
                </div>
            </div>
        </div>
    );
}

export default DoctorNavbar
