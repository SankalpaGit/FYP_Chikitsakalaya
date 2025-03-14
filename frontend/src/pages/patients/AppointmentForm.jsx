import React, { useEffect, useState } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import axios from 'axios';
import PatientLayout from '../../layouts/PatientLayout';
import { MdDateRange } from "react-icons/md";
import { IoTimeSharp } from "react-icons/io5";
import { FaClipboardList } from "react-icons/fa";
import { ImParagraphCenter } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";

const AppointmentForm = () => {
    const navigate = useNavigate()
    const { doctorId } = useParams();
    const [timeSlots, setTimeSlots] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [appointmentType, setAppointmentType] = useState("physical");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);

        const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
        const filteredSlots = timeSlots.filter(slot => slot.day === dayOfWeek);

        if (filteredSlots.length > 0) {
            setAvailableSlots(filteredSlots);
            setErrorMessage("");
        } else {
            setAvailableSlots([]);
            setErrorMessage("Sorry, doctor is not available for this date.");
        }
    };

    const handleConfirmAppointment = async () => {
        if (!selectedDate || !selectedSlot) {
            setErrorMessage("Please select a date and time slot.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const token = localStorage.getItem("token"); // Assuming the token is stored in localStorage

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
                        <input type="date" value={selectedDate} onChange={handleDateChange} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600" />
                    </div>

                    {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
                    {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

                    {availableSlots.length > 0 && (
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-700 mb-2">Available Time Slots:</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot.id)}
                                        className={`p-3 rounded-lg transition font-semibold text-gray-600 w-fit ${selectedSlot === slot.id ? 'border-2 bg-teal-100 border-teal-600' : 'bg-white text-gray-700 border-2  hover:bg-teal-100'}`}
                                    >
                                        {slot.startTime} - {slot.endTime}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block font-semibold text-gray-600 mb-1">Appointment Type:</label>
                        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)} className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-600">
                            <option value="physical">Physical</option>
                            <option value="online">Online</option>
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold text-gray-600 mb-1">Reason for Appointment:</label>
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

                {/* Rules Section */}
                <div className="w-full md:w-5/12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold text-teal-800 mb-10 text-center md:text-left">How to Fill the Form 😕 ?</h3>
                    <ul className="space-y-9 text-gray-700">
                        <li className="flex items-start gap-3">
                            <MdDateRange className="w-6 h-6 text-orange-600" /> First select your prefered date.
                        </li>
                        <li className="flex items-start gap-3">
                            <IoTimeSharp className="w-6 h-6 text-orange-600" /> Choose a time slot available for choosen date.
                        </li>
                        <li className="flex items-start gap-3">
                            <FaClipboardList className="w-6 h-6 text-orange-600" /> Select your prefered appointment option.
                        </li>
                        <li className="flex items-start gap-3">
                            <ImParagraphCenter className="w-6 h-6 text-orange-600" /> Provide a brief reason for your appointment.
                        </li>
                        <li className="flex items-start gap-3">
                            <GiConfirmed className="w-6 h-6 text-orange-600" /> Click 'Confirm Appointment' to finalize the booking.
                        </li>
                    </ul>
                </div>
            </div>
        </PatientLayout>
    );
};

export default AppointmentForm;
