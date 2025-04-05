import React, { useState } from 'react';
import { FaTachometerAlt, FaUserMd, FaUsers, FaBars, FaCaretDown, FaCommentDots, FaTags, FaCalendarCheck, FaMoneyBillAlt, FaCommentAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOffersDropdownOpen, setIsOffersDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleOffersDropdown = () => {
    setIsOffersDropdownOpen(!isOffersDropdownOpen);
  };

  return (
    <div className={`flex flex-col fixed top-0 left-0 h-screen bg-teal-700 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between px-4 py-3">
        <span className={`text-white text-xl font-bold ${!isOpen && 'hidden'}`}>Chikitsakalaya</span>
        <FaBars className="text-white cursor-pointer" onClick={toggleSidebar} />
      </div>

      <nav className="mt-10 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <Link to="/admin/dashboard" className="flex items-center w-full">
              <FaTachometerAlt className="mr-4" />
              <span className={`${!isOpen && 'hidden'}`}>Dashboard</span>
            </Link>
          </li>
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <Link to="/admin/request" className="flex items-center w-full">
              <FaUserMd className="mr-4" />
              <span className={`${!isOpen && 'hidden'}`}>Doctor Request</span>
            </Link>
          </li>
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer" onClick={toggleUserDropdown}>
            <FaUsers className="mr-4" />
            <span className={`${!isOpen && 'hidden'}`}>User Management</span>
            {isOpen && <FaCaretDown className={`ml-auto transition-transform ${isUserDropdownOpen ? 'rotate-180' : ''}`} />}
          </li>
          {isUserDropdownOpen && isOpen && (
            <ul className="ml-8 space-y-2">
              <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
                <span>Patient</span>
              </li>
              <Link to="/admin/user/doctor">
                <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
                  <span>Doctor</span>
                </li>
              </Link>
            </ul>
          )}
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <Link to="/admin/blog" className="flex items-center w-full">
              <FaCommentDots className="mr-4" />
              <span className={`${!isOpen && 'hidden'}`}>Blog</span>
            </Link>
          </li>
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer" onClick={toggleOffersDropdown}>
            <FaTags className="mr-4" />
            <span className={`${!isOpen && 'hidden'}`}>Offers</span>
            {isOpen && <FaCaretDown className={`ml-auto transition-transform ${isOffersDropdownOpen ? 'rotate-180' : ''}`} />}
          </li>
          {isOffersDropdownOpen && isOpen && (
            <ul className="ml-8 space-y-2">
              <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
                <span>Patient Offers</span>
              </li>
              <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
                <span>Doctor Offers</span>
              </li>
            </ul>
          )}
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <FaCalendarCheck className="mr-4" />
            <span className={`${!isOpen && 'hidden'}`}>Appointments</span>
          </li>
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <FaMoneyBillAlt className="mr-4" />
            <span className={`${!isOpen && 'hidden'}`}>Payments</span>
          </li>
          <li className="text-white flex items-center px-4 py-2 hover:bg-teal-600 cursor-pointer">
            <FaCommentAlt className="mr-4" />
            <span className={`${!isOpen && 'hidden'}`}>Feedback</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;