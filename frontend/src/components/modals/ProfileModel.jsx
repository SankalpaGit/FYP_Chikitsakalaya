import React from 'react';
import { FiUser } from 'react-icons/fi';         // User icon
import { MdFeedback } from 'react-icons/md';     // Feedback icon
import { RiLogoutBoxRLine } from 'react-icons/ri'; // Logout icon
import { useNavigate } from 'react-router-dom';   // Import useNavigate for navigation

const ProfileModel = ({ isOpen, profileImage, name, gmail, onLogout }) => {
  const navigate = useNavigate();  // Hook for navigation

  if (!isOpen) return null;

  const handleProfileClick = () => {
    navigate('/doctor/profile');  // Navigate to the doctor's profile page
  };

  const handleEditProfileClick = () => {
    navigate('/doctor/profile/edit');  // Navigate to the edit profile page
  };

  const handleLogout = () => {
    // Check if the token exists in localStorage
    if (localStorage.getItem('token')) {
      // Remove the token from localStorage
      localStorage.removeItem('token');
  
      // Navigate to the login page
      navigate('/doctor/login');
    } else {
      console.log('Logout Clicked but token not found');
    }
  };
  

  const handleComplainBoxClick = () => {
    navigate('/contact');  // Navigate to the contact page
  };

  return (
    <div className="absolute top-10 right-0 bg-white border border-gray-300 p-6 rounded-lg shadow-md w-96 z-50">
      
      {/* Profile Section */}
      <div className="flex items-center w-full gap-4 mb-4 hover:bg-gray-50 cursor-pointer" onClick={handleProfileClick}>
        <img
          src={profileImage}
          alt="Profile Avatar"
          className="w-20 h-20 rounded-full object-cover cursor-pointer"
        />
        <div className="flex flex-col justify-center">
          <p className="font-semibold text-lg text-gray-800 cursor-pointer">{name}</p>
          <p className="text-sm text-gray-500 cursor-pointer">{gmail}</p>
        </div>
      </div>

      <div className="bg-gray-200 h-0.5 w-full mb-2"></div>

      {/* Edit Profile Button */}
      <button
        className="flex items-center w-full text-teal-600 py-2 hover:bg-gray-50 text-base"
        onClick={handleEditProfileClick}
      >
        <FiUser className="mr-2" /> {/* New User Icon */}
        Edit Profile
      </button>

      {/* Complain Box Button */}
      <button
        className="flex items-center w-full text-teal-600 py-2 hover:bg-gray-50 text-base"
        onClick={handleComplainBoxClick}
      >
        <MdFeedback className="mr-2" /> {/* New Feedback Icon */}
        Complain Box
      </button>

      <div className="bg-gray-200 h-0.5 w-full mb-2"></div>

      {/* Logout Button */}
      <button
        className="flex items-center w-full text-red-600 py-2 hover:bg-gray-50"
        onClick={handleLogout}
      >
        <RiLogoutBoxRLine className="mr-2" /> {/* New Logout Icon */}
        Logout
      </button>
    </div>
  );
};

export default ProfileModel;
