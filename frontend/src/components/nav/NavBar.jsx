import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa"; // React Icons for Bell and User Circle

const NavBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // To store user name for Profile section
  const [userImage, setUserImage] = useState(""); // To store user image (profile picture)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const name = localStorage.getItem("userName"); // User name from localStorage or token
      const image = localStorage.getItem("userImage"); // User profile image from localStorage

      if (name) {
        setUserName(name);
      }

      if (image) {
        setUserImage(image);
      }
    } else {
      setIsLoggedIn(false);
    }

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`w-full z-50 transition-all duration-300 shadow-sm fixed bg-white ${isSticky ? "fixed top-0 bg-white shadow-md" : ""}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-teal-700">Chikitsakalaya</div>
        {isLoggedIn ? (
          <div className="space-x-6 flex items-center">
            <a href="#doctors" className="text-gray-800 hover:text-teal-700">Doctors</a>
            <a href="#appointments" className="text-gray-800 hover:text-teal-700">Appointments</a>
            <a href="#contact" className="text-gray-800 hover:text-teal-700">Contact</a>
            
            {/* Notification Icon */}
            <div className="relative">
              <FaBell className="text-teal-700 hover:text-teal-600 text-3xl" />
            </div>

            {/* Profile with circular image */}
            <div className="relative ml-4">
              {userImage ? (
                <img
                  src={userImage}
                  alt="Profile"
                  className=" rounded-full object-cover"
                />
              ) : (
                <FaUserCircle className="text-4xl text-teal-700" />
              )}
             
            </div>
          </div>
        ) : (
          <div className="space-x-6">
            <a href="#about" className="text-gray-800 hover:text-teal-700">About Us</a>
            <a href="#features" className="text-gray-800 hover:text-teal-700">Features</a>
            <a href="#pricing" className="text-gray-800 hover:text-teal-700">Pricing</a>
            <a href="#contact" className="text-gray-800 hover:text-teal-700">Contact</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
