import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Check login status on mount and route change
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Convert to boolean
    setUserName(localStorage.getItem("userName") || "User");
    setUserImage(localStorage.getItem("userImage") || "");
  }, [location.pathname]); // Runs on route change

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    setIsLoggedIn(false); // Update state
    navigate("/login");
  };

  return (
    <nav className="w-full z-50 transition-all duration-300 shadow-sm fixed bg-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-teal-700 cursor-pointer" onClick={() => navigate("/")}>Chikitsakalaya</div>
        {isLoggedIn ? (
          <div className="space-x-6 flex items-center">
            <a href="/appointments" className="text-gray-800 hover:text-teal-700">Appointments</a>
            <a href="/chat" className="text-gray-800 hover:text-teal-700">Chat</a>
            <a href="/report" className="text-gray-800 hover:text-teal-700">Reports</a>
            <a href="/prescription" className="text-gray-800 hover:text-teal-700">Prescription</a>
            <FaBell className="text-teal-700 hover:text-teal-600 text-3xl cursor-pointer" />

            <div className="relative ml-4 cursor-pointer">
              <div onClick={() => setShowDropdown(!showDropdown)}>
                {userImage ? (
                  <img src={userImage} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-teal-700" />
                ) : (
                  <FaUserCircle className="text-4xl text-teal-700" />
                )}
              </div>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <div className="py-2 px-4 text-gray-800 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/profile")}>
                    Profile
                  </div>
                  <div className="py-2 px-4 flex items-center text-red-600 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>
                    <IoLogOutOutline className="mr-2 text-lg" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-x-6 flex items-center">
            <a href="#about" className="text-gray-800 hover:text-teal-700">About Us</a>
            <a href="#features" className="text-gray-800 hover:text-teal-700">Policy</a>
            <a href="#pricing" className="text-gray-800 hover:text-teal-700">FAQs</a>
            <a href="#contact" className="text-gray-800 hover:text-teal-700">Contact</a>
            <div className="relative">
              <span
                className="text-gray-800 hover:text-teal-700 cursor-pointer"
                onClick={() => setShowRegisterDropdown(prev => !prev)} // Toggle on click
              >
                Register
              </span>

              {showRegisterDropdown && (
                <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
                  <a href="/doctor" className="block py-2 px-4 text-gray-800 hover:bg-gray-100">Register as Doctor</a>
                  <a href="/register" className="block py-2 px-4 text-gray-800 hover:bg-gray-100">Register as Patient</a>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
