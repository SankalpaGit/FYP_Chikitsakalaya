import React, { useEffect, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import axios from 'axios';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (!token) {
          console.error('No token found, redirecting to login');
          // Redirect to login or handle unauthorized access
          return;
        }
        const res = await axios.get('http://localhost:5000/api/doctor/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDashboardData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <DoctorLayout>
      <div className='w-11/12 h-full flex m-auto justify-between'>

        {/* Left Section */}
        <div className='w-8/12 h-full space-y-6'>

          {/* Welcome Section */}
          <div className='p-6 bg-teal-600 rounded-lg shadow-md h-40 flex flex-col justify-center'>
            <h2 className="font-bold text-gray-100 text-2xl">
              Welcome, Doctor {dashboardData.doctorName}
            </h2>
            <p className="text-gray-200 mt-2">
              You have {dashboardData.remainingAppointments} remaining appointments today
            </p>
            <p className="text-gray-200">
              "Stay healthy, stay happy."
            </p>
          </div>

          {/* Dashboard Stats */}
          <div className='grid grid-cols-4 gap-4'>
            <div className="text-center border-2 border-orange-200 bg-orange-100 p-4 rounded-lg shadow-md h-32 flex flex-col justify-center items-center">
              <h3 className="text-4xl font-bold text-gray-600">{dashboardData.totalAppointments}</h3>
              <p className="text-gray-600">Total Appointments</p>
            </div>
            <div className="text-center border-2 border-orange-200 bg-orange-100 p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <h3 className="text-4xl font-bold text-gray-600">{dashboardData.completedAppointments}</h3>
              <p className="text-gray-600">Completed Appointments</p>
            </div>
            <div className="text-center border-2 border-orange-200 bg-orange-100 p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <h3 className="text-4xl font-bold text-gray-600">{dashboardData.uniquePatientsChecked}</h3>
              <p className="text-gray-600">Patients Checked</p>
            </div>
            <div className="text-center border-2 border-orange-200 bg-orange-100 p-4 rounded-lg shadow-md flex flex-col justify-center items-center">
              <h3 className="text-4xl font-bold text-gray-600">{dashboardData.remainingAppointments}</h3>
              <p className="text-gray-600">Remaining Appointments</p>
            </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className='bg-blue-400 w-3/12 h-full rounded-lg shadow-md p-4'>
          <p className="text-white">Right sidebar content</p>
        </div>

      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
