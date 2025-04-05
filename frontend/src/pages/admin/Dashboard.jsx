import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import {
  FaUsers,
  FaUserMd,
  FaCalendarCheck,
  FaDollarSign,
  FaCheckCircle,
  FaBlog,
  FaBullhorn
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const stats = {
  totalPatients: 1250,
  totalDoctors: 45,
  appointmentsToday: 87,
  totalRevenue: 15420.50
};

// Chart data
const lineChartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Appointments',
      data: [65, 59, 80, 81, 56, 55, 40],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }
  ]
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: true }
  },
  scales: { y: { beginAtZero: true } }
};

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, Admin!</p>
          </div>
          <div
            whileHover={{ scale: 1.05 }}
            className=" text-gray-500"
          >
            <p className="text-sm">Today's Date</p>
            <p className="text-lg font-semibold">
              {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FaUsers, title: 'Total Patients', value: stats.totalPatients.toLocaleString(), gradient: 'from-blue-500 to-blue-600' },
            { icon: FaUserMd, title: 'Total Doctors', value: stats.totalDoctors, gradient: 'from-green-500 to-green-600' },
            { icon: FaCalendarCheck, title: 'Appointments Today', value: stats.appointmentsToday, gradient: 'from-purple-500 to-purple-600' },
            { icon: FaDollarSign, title: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, gradient: 'from-yellow-500 to-yellow-600' },
          ].map((stat, index) => (
            <div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-xl shadow-lg text-white flex items-center justify-between`}
            >
              <div>
                <p className="text-sm opacity-80">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
              <stat.icon className="text-4xl text-white" />
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts */}
          <div className="lg:col-span-2 space-y-6">
            <div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Weekly Appointments</h2>
              <div className="h-80">
                <Line data={lineChartData} options={{ ...chartOptions, title: { text: 'Weekly Appointments' } }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Actions</h2>
              <div className="space-y-4">
                {[
                  { action: 'Doctor Approval', icon: FaCheckCircle, bg: 'bg-blue-500 hover:bg-blue-600' },
                  { action: 'Add Blog', icon: FaBlog, bg: 'bg-green-500 hover:bg-green-600' },
                  { action: 'Make Announcement', icon: FaBullhorn, bg: 'bg-purple-500 hover:bg-purple-600' }
                ].map((item, index) => (
                  <button
                    key={item.action}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-lg text-white font-medium ${item.bg} flex items-center justify-center space-x-2`}
                  >
                    <item.icon className="text-xl" />
                    <span>{item.action}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;