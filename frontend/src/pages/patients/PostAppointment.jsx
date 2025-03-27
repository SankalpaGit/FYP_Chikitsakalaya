import React, { useEffect, useState } from "react";
import axios from "axios";
import PatientLayout from "../../layouts/PatientLayout";

const PostAppointment = () => {
    const [tickets, setTickets] = useState([]); // Changed to an array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                const response = await axios.get(
                    "http://localhost:5000/api/appointment/ticket",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                console.log(response.data);
                setTickets(response.data.tickets || []); // Ensure an array is stored
            } catch (err) {
                setError(err.message || "Failed to load tickets");
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    return (
        <PatientLayout>
            <div className="p-10">
                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">Maybe you don't have any physical appointment.</p>
                ) : tickets.length > 0 ? ( // Check if array has items
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tickets.map((ticket, index) => (
                            <div 
                                key={index} 
                                className="relative w-80 h-96 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300"
                            >
                                {/* PDF Display Without Controls */}
                                <embed 
                                    src={`http://localhost:5000${ticket.pdfLink}`} 
                                    type="application/pdf" 
                                    className="w-full h-full"
                                />

                                {/* Token Number */}
                                <div className="absolute bottom-0 left-0 w-full bg-orange-600 bg-opacity-80 text-white text-center py-2 text-sm font-semibold">
                                    Token: {ticket.tokenNumber}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No ticket found.</p>
                )}
            </div>
        </PatientLayout>
    );
};

export default PostAppointment;
