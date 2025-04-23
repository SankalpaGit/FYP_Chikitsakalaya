import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorLayout from '../../layouts/DoctorLayout';
import {FaDollarSign, FaCalendarTimes, FaUser, FaCalendarAlt, FaClock, FaUserMd, FaArrowLeft, FaArrowRight, FaCalendar, FaWallet } from 'react-icons/fa';
import { IoIosArrowDown } from 'react-icons/io';
import { toast } from 'react-toastify';

const Payment = () => {
    const [appointments, setAppointments] = useState([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [wallet, setWallet] = useState({ balance: 0, withdrawalHistory: [] });
    
    const [typeFilter, setTypeFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [paymentPage, setPaymentPage] = useState(1);
    const [withdrawalPage, setWithdrawalPage] = useState(1);
    const [rowsPerPage] = useState(3);
    const [activeTab, setActiveTab] = useState('withdrawals'); // Default to Withdrawal History
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchPayments();
        fetchWallet();
    }, [token]);

    const fetchPayments = async () => {
        if (!token) {
            console.error('No token found.');
            toast.error('Please log in to view payments.', { autoClose: 3000 });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:5000/api/doctor/paid', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAppointments(response.data.data.appointments || []);
            setTotalEarnings(Number(response.data.data.totalEarnings) || 0);
        } catch (error) {
            console.error('Error fetching payments:', error.response?.data || error.message);
            toast.error('Failed to fetch payments.', { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const fetchWallet = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/wallet', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setWallet({
                balance: Number(response.data.data.balance) || 0,
                withdrawalHistory: response.data.data.withdrawalHistory || [],
            });
        } catch (error) {
            console.error('Error fetching wallet:', error.response?.data || error.message);
            toast.error('Failed to fetch wallet details.', { autoClose: 3000 });
        }
    };

    const handleWithdraw = async () => {
        if (!withdrawalAmount || Number(withdrawalAmount) <= 0) {
            toast.warn('Please enter a valid withdrawal amount.', { autoClose: 3000 });
            return;
        }

        if (Number(withdrawalAmount) > totalEarnings) {
            toast.warn('Withdrawal amount exceeds total earnings.', { autoClose: 3000 });
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:5000/api/withdraw',
                { amount: Number(withdrawalAmount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(
                `Withdrawal successful! Received ₹${response.data.data.amountReceived.toFixed(2)} after ₹${response.data.data.deduction.toFixed(2)} deduction.`,
                { autoClose: 3000 }
            );
            setWithdrawalAmount('');
            fetchPayments();
            fetchWallet();
        } catch (error) {
            console.error('Error processing withdrawal:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to process withdrawal.', { autoClose: 3000 });
        }
    };

    const isUpcoming = (appointmentDate) => {
        return new Date(appointmentDate) >= new Date(new Date().setHours(0, 0, 0, 0));
    };

    const filteredAppointments = appointments.filter((appt) => {
        const matchName = `${appt.Patient?.firstName} ${appt.Patient?.lastName}`
            .toLowerCase()
        const matchType = typeFilter === 'all' || appt.appointmentType === typeFilter;
        const matchTime =
            timeFilter === 'all' ? true : timeFilter === 'upcoming' ? isUpcoming(appt.date) : !isUpcoming(appt.date);
        return matchName && matchType && matchTime;
    });

    // Pagination for Payment History
    const paymentIndexOfLastRow = paymentPage * rowsPerPage;
    const paymentIndexOfFirstRow = paymentIndexOfLastRow - rowsPerPage;
    const currentPaymentRows = filteredAppointments.slice(paymentIndexOfFirstRow, paymentIndexOfLastRow);
    const paymentTotalPages = Math.ceil(filteredAppointments.length / rowsPerPage);

    // Pagination for Withdrawal History
    const withdrawalIndexOfLastRow = withdrawalPage * rowsPerPage;
    const withdrawalIndexOfFirstRow = withdrawalIndexOfLastRow - rowsPerPage;
    const currentWithdrawalRows = wallet.withdrawalHistory.slice(withdrawalIndexOfFirstRow, withdrawalIndexOfLastRow);
    const withdrawalTotalPages = Math.ceil(wallet.withdrawalHistory.length / rowsPerPage);

    const handlePaymentPageChange = (pageNumber) => {
        setPaymentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleWithdrawalPageChange = (pageNumber) => {
        setWithdrawalPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <DoctorLayout>
            <div className="p-2 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Payments</h2>
                    <div className="flex space-x-4 items-center">
                        {/* Tabs for Appointment Filters */}
                        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg shadow-sm">
                            {['all', 'physical', 'online'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(type)}
                                    className={`px-4 py-2 rounded-md font-medium transition duration-200 ${
                                        typeFilter === type
                                            ? 'bg-teal-600 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Time Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 pl-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option value="all">All</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="previous">Previous</option>
                            </select>
                            <IoIosArrowDown className="absolute right-2 top-3 pointer-events-none text-gray-500" />
                        </div>

                       
                    </div>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3">
                    {/* Total Earnings */}
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-teal-100 rounded-full">
                            <FaDollarSign className="text-teal-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                            <p className="text-2xl font-semibold text-gray-800">₹{totalEarnings.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Wallet Balance */}
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm flex items-center space-x-4">
                        <div className="p-3 bg-teal-100 rounded-full">
                            <FaWallet className="text-teal-600 text-2xl" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Wallet Balance</h3>
                            <p className="text-2xl font-semibold text-gray-800">₹{wallet.balance.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Withdraw Funds */}
                    <div className="bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">Withdraw Funds</h3>
                        <div className="flex items-center space-x-3">
                            <div className="relative flex-1">
                                <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    placeholder="Enter amount"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                                />
                            </div>
                            <button
                                onClick={handleWithdraw}
                                className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-200 font-medium shadow-sm"
                            >
                                Withdraw
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Note: A 15% service fee will be deducted.</p>
                    </div>
                </div>

                {/* History Section */}
                <div className="bg-white rounded-lg shadow-md border border-gray-400">
                    {/* Tabs for History */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-6 py-3 font-medium text-sm ${
                                activeTab === 'withdrawals'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('withdrawals')}
                        >
                            Withdrawal History
                        </button>
                        <button
                            className={`px-6 py-3 font-medium text-sm ${
                                activeTab === 'payments'
                                    ? 'border-b-2 border-teal-600 text-teal-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                            onClick={() => setActiveTab('payments')}
                        >
                            Payment History
                        </button>
                    </div>

                    {/* History Content */}
                    {loading ? (
                        <div className="text-center text-gray-600 p-6">Loading...</div>
                    ) : activeTab === 'payments' ? (
                        filteredAppointments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                <FaCalendarTimes className="text-8xl text-orange-600 mb-4 opacity-70" />
                                <p className="text-lg font-medium">No payments to display yet.</p>
                                <p className="text-sm">Check back later or try adjusting filters.</p>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Patient</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {currentPaymentRows.map((appointment) => (
                                                <tr key={appointment.id} className="hover:bg-gray-50 transition duration-150">
                                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                                        <div className="flex items-center">
                                                            <FaUser className="mr-2 text-teal-500" />
                                                            {appointment.Patient?.firstName} {appointment.Patient?.lastName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div className="flex items-center">
                                                            <FaCalendarAlt className="mr-2 text-teal-500" />
                                                            {new Date(appointment.date).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: '2-digit',
                                                            })}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div className="flex items-center">
                                                            <FaClock className="mr-2 text-teal-500" />
                                                            {new Date(`${appointment.date}T${appointment.StartTime}`).toLocaleTimeString(
                                                                'en-US',
                                                                { hour: 'numeric', minute: '2-digit', hour12: true }
                                                            )}{' '}
                                                            -{' '}
                                                            {new Date(`${appointment.date}T${appointment.EndTime}`).toLocaleTimeString(
                                                                'en-US',
                                                                { hour: 'numeric', minute: '2-digit', hour12: true }
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 capitalize">
                                                        <div className="flex items-center">
                                                            <FaUserMd className="mr-2 text-teal-500" />
                                                            {appointment.appointmentType}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        <div className="flex items-center">
                                                            <FaDollarSign className="mr-2 text-teal-500" />
                                                            ₹{(Number(appointment.Payment?.amount) || 0).toFixed(2)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment Pagination */}
                                {paymentTotalPages > 1 && (
                                    <div className="flex justify-between items-center p-4 border-t border-gray-200 m-auto">
                                        
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handlePaymentPageChange(paymentPage - 1)}
                                                disabled={paymentPage === 1}
                                                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                <FaArrowLeft className="mr-2" /> Previous
                                            </button>
                                            {Array.from({ length: paymentTotalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePaymentPageChange(page)}
                                                    className={`px-3 py-1 rounded-lg ${
                                                        paymentPage === page
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePaymentPageChange(paymentPage + 1)}
                                                disabled={paymentPage === paymentTotalPages}
                                                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                Next <FaArrowRight className="ml-2" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    ) : wallet.withdrawalHistory.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                            <FaCalendarTimes className="text-8xl text-orange-600 mb-4 opacity-70" />
                            <p className="text-lg font-medium">Haven't withdrawn any amount yet.</p>
                            <p className="text-sm">Withdraw funds to see your history here.</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full table-auto">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Amount Requested
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Deduction (15%)
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                                Amount Received
                                            </th>
                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentWithdrawalRows.map((withdrawal) => (
                                            <tr key={withdrawal.id} className="hover:bg-gray-50 transition duration-150">
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center">
                                                        <FaCalendar className="mr-2 text-teal-500" />
                                                        {new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: '2-digit',
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center">
                                                        <FaDollarSign className="mr-2 text-teal-500" />
                                                        ₹{(Number(withdrawal.amountRequested) || 0).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center">
                                                        <FaDollarSign className="mr-2 text-teal-500" />
                                                        ₹{(Number(withdrawal.deduction) || 0).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">
                                                    <div className="flex items-center">
                                                        <FaDollarSign className="mr-2 text-teal-500" />
                                                        ₹{(Number(withdrawal.amountReceived) || 0).toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            withdrawal.status === 'completed'
                                                                ? 'bg-green-100 text-green-800'
                                                                : withdrawal.status === 'pending'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {withdrawal.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            {/* Withdrawal Pagination */}
                            {withdrawalTotalPages > 1 && (
                                <div className="flex justify-between items-center p-4 border-t border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        Showing {withdrawalIndexOfFirstRow + 1} to{' '}
                                        {Math.min(withdrawalIndexOfLastRow, wallet.withdrawalHistory.length)} of{' '}
                                        {wallet.withdrawalHistory.length} withdrawals
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleWithdrawalPageChange(withdrawalPage - 1)}
                                            disabled={withdrawalPage === 1}
                                            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            <FaArrowLeft className="mr-2" /> Previous
                                        </button>
                                        {Array.from({ length: withdrawalTotalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handleWithdrawalPageChange(page)}
                                                className={`px-3 py-1 rounded-lg ${
                                                    withdrawalPage === page
                                                        ? 'bg-teal-600 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => handleWithdrawalPageChange(withdrawalPage + 1)}
                                            disabled={withdrawalPage === withdrawalTotalPages}
                                            className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                        >
                                            Next <FaArrowRight className="ml-2" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DoctorLayout>
    );
};

export default Payment;