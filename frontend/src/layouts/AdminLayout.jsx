import React from 'react';
import AdminSidebar from '../components/nav/AdminSidebar';
import AdminNavbar from '../components/nav/AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex w-full min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <AdminNavbar />

        {/* Main Content */}
        <div className="mt-16 p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;