import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showRegisterDropdown, setShowRegisterDropdown] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef(null);

  // Check login status and fetch unread notification count
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setUserName(localStorage.getItem("userName") || "User");
    setUserImage(localStorage.getItem("userImage") || "");

    if (token) {
      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/notifications", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.data.success) {
            const unread = response.data.notifications.filter(n => !n.isRead).length;
            setUnreadCount(unread);
          }
        } catch (err) {
          console.error("Error fetching unread notifications:", err);
        }
      };
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [location.pathname]);

  // Close notification modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotificationModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch notifications when modal opens
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.notifications.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => prev - 1);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await Promise.all(
        notifications
          .filter(n => !n.isRead)
          .map(n =>
            axios.patch(
              `http://localhost:5000/api/notifications/${n.id}/read`,
              {},
              { headers: { Authorization: `Bearer ${token}` } }
            )
          )
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userImage");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="w-full z-50 transition-all duration-300 shadow-sm fixed bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-teal-700 cursor-pointer" onClick={() => navigate("/")}>Chikitsakalaya</div>
        {isLoggedIn ? (
          <div className="space-x-6 flex items-center">
            <a href="/appointments" className="text-gray-800 hover:text-teal-700">Appointments</a>
            <a href="/chat" className="text-gray-800 hover:text-teal-700">Chat</a>
            <a href="/post-appointments" className="text-gray-800 hover:text-teal-700">Token</a>
            <a href="/prescription" className="text-gray-800 hover:text-teal-700">Prescription</a>
            <a href="/followup" className="text-gray-800 hover:text-teal-700">followup</a>
            <div className="relative" ref={notificationRef}>
              <FaBell
                className="text-teal-700 hover:text-teal-600 text-3xl cursor-pointer"
                onClick={() => {
                  setShowNotificationModal(!showNotificationModal);
                  if (!showNotificationModal) fetchNotifications();
                }}
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
              {showNotificationModal && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-bold text-teal-800">Notifications</h2>
                    <button
                      className="text-gray-600 hover:text-gray-800 text-sm"
                      onClick={() => setShowNotificationModal(false)}
                    >
                      ✕
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-gray-600 text-center p-4">No notifications</p>
                  ) : (
                    <div className="p-2">
                      <button
                        className="text-sm text-teal-700 hover:text-teal-900 w-full text-left p-2"
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                      >
                        Mark All as Read
                      </button>
                      <div className="space-y-2">
                        {notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-md ${notification.isRead ? 'bg-gray-100' : 'bg-teal-50 border border-teal-200'}`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`text-sm ${notification.isRead ? 'text-gray-600' : 'text-gray-800 font-semibold'}`}>
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(notification.createdAt).toLocaleString()}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <button
                                  className="text-xs text-teal-700 hover:text-teal-900"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Mark as Read
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

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
                onClick={() => setShowRegisterDropdown(prev => !prev)}
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