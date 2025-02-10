import React from 'react';
import DoctorSidebar from '../components/nav/DoctorSidebar';
import DoctorNavbar from '../components/nav/DoctorNavbar';

const DoctorLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <DoctorSidebar />

      <div className="flex-1 flex flex-col ml-20"> 
        {/* Fixed Navbar */}
        <DoctorNavbar />

        {/* Main Content */}
        <div className="p-4 pt-16 mt-10"> 
          {children}
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
