import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaUserCircle, FaComments } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";  // New Logout Icon

const NavBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);  // Dropdown state
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setUserName(localStorage.getItem("userName") || "User");
      setUserImage(localStorage.getItem("userImage") || "");
    }

    const handleScroll = () => {
      setIsSticky(window.scrollY > window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsLoggedIn(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className={`w-full z-50 transition-all duration-300 shadow-sm fixed bg-white ${isSticky ? "fixed top-0 bg-white shadow-md" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-teal-700 cursor-pointer" onClick={() => navigate("/")}>Chikitsakalaya</div>
        {isLoggedIn ? (
          <div className="space-x-6 flex items-center">
            <a href="/doctors" className="text-gray-800 hover:text-teal-700">Doctors</a>
            <a href="/appointments" className="text-gray-800 hover:text-teal-700">Appointments</a>
            <a href="/contact" className="text-gray-800 hover:text-teal-700">Contact</a>
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
            <a href="#features" className="text-gray-800 hover:text-teal-700">Features</a>
            <a href="#pricing" className="text-gray-800 hover:text-teal-700">Pricing</a>
            <a href="#contact" className="text-gray-800 hover:text-teal-700">Contact</a>
            <div className="relative" onMouseEnter={() => setShowRegisterDropdown(true)} onMouseLeave={() => setShowRegisterDropdown(true)}>
              <span className="text-gray-800 hover:text-teal-700 cursor-pointer">Register</span>
              {showRegisterDropdown && (
                <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200" onMouseEnter={() => setShowRegisterDropdown(true)} onMouseLeave={() => setShowRegisterDropdown(false)}>
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
