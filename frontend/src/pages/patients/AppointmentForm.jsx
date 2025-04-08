import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import { MdDateRange } from "react-icons/md";
import { IoTimeSharp } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { ImParagraphCenter } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";

// helper to format 24hr to 12hr time
const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const h = parseInt(hour);
    const m = minute;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hr = h % 12 === 0 ? 12 : h % 12;
    return `${hr}:${m} ${ampm}`;
};

const AppointmentForm = () => {
    const navigate = useNavigate();
    const { doctorId } = useParams();

    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [appointmentType, setAppointmentType] = useState("physical");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [description, setDescription] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // fetch all slots initially
    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/show/time-slot/${doctorId}`);
                if (response.data.success) {
                    setTimeSlots(response.data.timeSlots);
                } else {
                    console.error("Error fetching time slots:", response.data.message);
                }
            } catch (error) {
                console.error("Server error:", error);
            }
        };
        fetchTimeSlots();
    }, [doctorId]);

    // run slot filter logic when date or type changes
    useEffect(() => {
        if (selectedDate) {
            const dayOfWeek = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
            const filtered = timeSlots.filter(slot =>
                slot.day === dayOfWeek && slot.appointmentType === appointmentType
            );

            if (filtered.length > 0) {
                setAvailableSlots(filtered);
                setErrorMessage("");
            } else {
                setAvailableSlots([]);
                setErrorMessage("Sorry, no slots available for this date and type.");
            }

            setSelectedSlot(null); // reset selected slot
        }
    }, [selectedDate, appointmentType, timeSlots]);

    const handleConfirmAppointment = async () => {
        if (!selectedDate || !selectedSlot) {
            setErrorMessage("Please select a date and time slot.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token");
            const selectedSlotData = availableSlots.find(slot => slot.id === selectedSlot);

            if (!selectedSlotData) {
                setErrorMessage("Invalid time slot selected.");
                setLoading(false);
                return;
            }

            const appointmentData = {
                doctorId,
                date: selectedDate,
                StartTime: selectedSlotData.startTime,
                EndTime: selectedSlotData.endTime,
                appointmentType,
                description
            };

            const response = await axios.post(
                "http://localhost:5000/api/doctor/appointment/create",
                appointmentData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.data.success) {
                const appointmentID = response.data.appointment.id;
                setSuccessMessage("Appointment booked successfully!");
                setSelectedDate("");
                setSelectedSlot(null);
                setDescription("");
                setAppointmentType("physical");

                setTimeout(() => {
                    navigate(`/payment/${appointmentID}`);
                }, 2000);
            } else {
                setErrorMessage(response.data.message || "Failed to book appointment.");
            }
        } catch (error) {
            console.error("Error booking appointment:", error.response?.data || error);
            setErrorMessage("Server error: Could not book appointment.");
        }

        setLoading(false);
    };

    return (
        <PatientLayout>
            <div className='flex flex-col md:flex-row w-9/12 m-auto justify-evenly gap-6'>
                <div className="w-full md:w-5/12 border-2 border-gray-300 bg-white p-6 rounded-lg shadow-md mb-10 mt-5">
                    <h2 className="text-2xl font-bold mb-6 text-center text-teal-800">Book an Appointment</h2>

                    <div className="mb-4">
                        <label className="block font-semibold text-gray-600 mb-1">Select Date:</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600" />
                    </div>

                    <div className="mb-4">
                        <label className="block font-semibold text-gray-600 mb-1">Appointment Type:</label>
                        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600">
                            <option value="physical">Physical</option>
                            <option value="online">Online</option>
                        </select>
                    </div>

                    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

                    {availableSlots.length > 0 && (
                        <div className="mb-4">
                            <div className="grid grid-cols-2 gap-3">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot.id)}
                                        className={`w-3/6 p-2 text-sm rounded-md transition font-semibold border 
                                            ${selectedSlot === slot.id ? 'bg-teal-100 border-teal-600 text-teal-800' : 'bg-white text-gray-800 border-gray-300 hover:bg-teal-50'}`}
                                    >
                                        {formatTime(slot.startTime)}  {formatTime(slot.endTime)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600" rows="3" placeholder="Describe your reason for the appointment..."></textarea>
                    </div>

                    <button
                        onClick={handleConfirmAppointment}
                        className="w-full p-3 bg-teal-800 text-white font-semibold rounded-lg hover:bg-teal-900 transition"
                        disabled={loading}
                    >
                        {loading ? "Booking..." : "Confirm Appointment"}
                    </button>
                </div>

                {/* Instructions */}
                <div className="w-full md:w-5/12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-teal-800 mb-10 text-center md:text-left">How to Fill the Form 😕 ?</h3>
                    <ul className="space-y-9 text-gray-700">
                        <li className="flex items-start gap-3"><MdDateRange className="w-6 h-6 text-orange-600" /> First select your preferred date.</li>
                        <li className="flex items-start gap-3"><FaClipboardList className="w-6 h-6 text-orange-600" /> Then select appointment type.</li>
                        <li className="flex items-start gap-3"><IoTimeSharp className="w-6 h-6 text-orange-600" /> Choose an available time slot.</li>
                        <li className="flex items-start gap-3"><ImParagraphCenter className="w-6 h-6 text-orange-600" /> Describe your reason briefly.</li>
                        <li className="flex items-start gap-3"><GiConfirmed className="w-6 h-6 text-orange-600" /> Hit 'Confirm Appointment' to finalize.</li>
                    </ul>
                </div>
            </div>
        </PatientLayout>
    );
};

export default AppointmentForm;
