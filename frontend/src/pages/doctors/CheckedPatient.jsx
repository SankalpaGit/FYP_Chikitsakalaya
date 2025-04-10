import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';
import { FaSync, FaSearch, FaCalendarCheck } from 'react-icons/fa';

const CheckedPatient = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const token = localStorage.getItem('token');

    const fetchCompletedAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/view/appointments/completed', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data.appointments);
            console.log('Completed appointments:', response.data.appointments);
            
        } catch (error) {
            console.error('Error fetching completed appointments:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchCompletedAppointments();
    }, [token]);

    const filteredAppointments = appointments.filter((appt) =>
        `${appt.Patient?.firstName} ${appt.Patient?.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DoctorLayout>
            <div className="p-6 max-w-7xl mx-auto">
                {/* Header with Search and Refresh */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-600">Patient History</h2>
                    <div className="flex space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by patient name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        <button
                            onClick={fetchCompletedAppointments}
                            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition duration-200 flex items-center"
                            disabled={loading}
                        >
                            <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                            {loading ? 'Refreshing...' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {/* Table or Empty State */}
                {filteredAppointments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <FaCalendarCheck className="text-7xl text-green-500 mb-4 opacity-70" />
                        <p className="text-lg font-medium">No completed appointments found.</p>
                        <p className="text-sm">Try searching or refreshing the list.</p>
                    </div>
                ) : (
                    <div className="bg-white border overflow-hidden animate-fadeIn">
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-auto">
                                <thead className="bg-teal-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredAppointments.map((appt) => {
                                        const formattedDate = new Date(appt.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        });

                                        const formatTime = (timeStr) => {
                                            const [hours, minutes, seconds] = timeStr.split(':');
                                            const date = new Date();
                                            date.setHours(+hours);
                                            date.setMinutes(+minutes);
                                            date.setSeconds(+seconds);
                                            return date.toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            });
                                        };

                                        const startTimeFormatted = formatTime(appt.StartTime);
                                        const endTimeFormatted = formatTime(appt.EndTime);

                                        return (
                                            <tr key={appt.id} className="hover:bg-teal-50 transition duration-150">
                                                <td className="px-6 py-4 text-gray-800 font-medium">
                                                    {appt.Patient?.firstName} {appt.Patient?.lastName}
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{formattedDate}</td>
                                                <td className="px-6 py-4 text-gray-600">{`${startTimeFormatted} - ${endTimeFormatted}`}</td>
                                                <td className="px-6 py-4 text-gray-600 capitalize">{appt.appointmentType}</td>
                                                <td className="px-6 py-4 text-gray-600">{appt.description || 'No description'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>

                            </table>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default CheckedPatient;
