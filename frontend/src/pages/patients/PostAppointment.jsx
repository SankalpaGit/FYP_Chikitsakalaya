import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineEye, AiOutlineDownload } from 'react-icons/ai';
import PatientLayout from '../../layouts/PatientLayout';

const PostAppointment = () => {
    const [ticket, setTicket] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve token from local storage
              

                if (!token) throw new Error('No authentication token found');
                const response = await axios.get('http://localhost:5000/api/appointment/ticket', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setTicket(response.data.ticket);
            } catch (err) {
               
                setError(err.message || 'Failed to load ticket');
            } finally {
                setLoading(false);
            }
        };

        fetchTicket();
    }, []);


    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <PatientLayout>
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Appointment Ticket</h2>

                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">{error}</p>
                ) : ticket ? (
                    <div className="relative w-64 h-80 bg-white shadow-lg rounded-xl overflow-hidden group border border-gray-300">
                        {/* PDF Thumbnail (Simulated) */}
                        <div
                            className="h-3/4 bg-gray-100 flex items-center justify-center cursor-pointer"
                            onClick={handleOpen}
                        >
                            <img
                                src={`http://localhost:5000${ticket.pdfLink}`}
                                className="w-full h-full"
                                title="Appointment Ticket"
                            ></img>
                        </div>

                        {/* Token Number (Floating UI) */}
                        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-80 text-white text-center py-2">
                            Token: {ticket.tokenNumber}
                        </div>

                        {/* Action Buttons */}
                        <div className="p-4 flex justify-between items-center">
                            <button
                                onClick={handleOpen}
                                className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                                <AiOutlineEye size={20} className="mr-2" /> View
                            </button>
                            <a
                                href={`http://localhost:5000${ticket.pdfLink}`}
                                download
                                className="flex items-center text-green-600 hover:text-green-800"
                            >
                                <AiOutlineDownload size={20} className="mr-2" /> Download
                            </a>
                        </div>
                    </div>
                ) : (
                    <p>No ticket found.</p>
                )}

                {/* PDF View Modal */}
                {open && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-4 rounded-lg w-3/4 h-3/4 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                onClick={handleClose}
                            >
                                ✕
                            </button>
                            <h3 className="text-lg font-semibold mb-2">Appointment Ticket</h3>
                            <iframe
                                src={`http://localhost:5000${ticket.pdfLink}`}
                                className="w-full h-full"
                                title="Appointment Ticket"
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
};

export default PostAppointment;
