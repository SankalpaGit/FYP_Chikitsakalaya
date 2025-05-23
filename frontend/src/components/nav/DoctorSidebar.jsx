import React from 'react';
import { MdMarkUnreadChatAlt } from "react-icons/md";
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaUserInjured, FaCalendarCheck, FaMoneyBillAlt, FaCommentAlt, FaClock, FaTasks, FaCalendarDay } from 'react-icons/fa';
import { FaPrescriptionBottleMedical } from "react-icons/fa6";

const DoctorSidebar = () => {
  return (
    <div className="flex flex-col w-20 h-screen bg-white shadow-md fixed">
      <div className="flex items-center justify-center px-4 py-3">
        <img src="/projects/logo.png" alt="Logo" className="w-14 h-auto" /> {/* Increased logo size */}
      </div>

      <nav className="">
        <ul className="space-y-6"> {/* Added space-y-6 for vertical spacing */}
          {/* Dashboard */}
          <li className="relative group flex justify-center mt-6 mb-6">
            <Link to="/doctor/dashboard">
              <FaTachometerAlt className="text-teal-600 text-2xl" /> {/* Increased icon size */}
              <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold duration-300 whitespace-nowrap">
                Dashboard
              </span>
            </Link>
          </li>

          {/* Personalization - Set Free Time */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/schedule">
            <FaClock className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1  opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Set Free Time
            </span>
            </Link>
          </li>

          {/* Personalization - To-Do List */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/tasks">
            <FaTasks className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              To-Do List
            </span>
            </Link>
          </li>

          {/* Appointments  */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/view/appointment">
            <FaCalendarDay className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Appointments
            </span>
            </Link>
          </li>

          {/* Patient History */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/appointment/history">
            <FaUserInjured className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Patient History
            </span>
            </Link>
          </li>

          {/* Payments */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/payment">
            <FaMoneyBillAlt className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Payments
            </span>
            </Link>
          </li>

          {/* Chats */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/chat">
            <MdMarkUnreadChatAlt className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Chats
            </span>
            </Link>
          </li>

          {/* prescription */}
          <li className="relative group flex justify-center mt-6 mb-6">
          <Link to="/doctor/prescription">
            <FaPrescriptionBottleMedical className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Prescription
            </span>
            </Link>
          </li>

           {/* Feedback */}
           <li className="relative group flex justify-center mt-6 mb-6">
            <Link to="/doctor/followup">
            <FaCalendarCheck className="text-teal-600 text-2xl" /> {/* Increased icon size */}
            <span className="absolute left-2 top-1 opacity-0 group-hover:opacity-100 bg-white text-teal-800 font-semibold px-2 py-1 rounded-md shadow-lg transition-opacity duration-300 whitespace-nowrap">
              Followup
            </span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DoctorSidebar;
