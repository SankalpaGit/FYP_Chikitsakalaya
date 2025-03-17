import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineEye, AiOutlineDownload } from "react-icons/ai";
import PatientLayout from "../../layouts/PatientLayout";

const PostAppointment = () => {
    const [ticket, setTicket] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No authentication token found");

                const response = await axios.get(
                    "http://localhost:5000/api/appointment/ticket",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                console.log(response);
                
                setTicket(response.data.ticket);
            } catch (err) {
                setError(err.message || "Failed to load ticket");
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
            <div className="p-10">
                {loading ? (
                    <p className="text-gray-600">Loading...</p>
                ) : error ? (
                    <p className="text-red-500">May be You dont have any Physical Appointmnt</p>
                ) : ticket ? (
                    <div className="relative w-80 h-96 bg-white shadow-lg rounded-xl overflow-hidden border border-gray-300">
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
                
                ) : (
                    <p className="text-gray-600">No ticket found.</p>
                )}


            </div>
        </PatientLayout>
    );
};

export default PostAppointment;
