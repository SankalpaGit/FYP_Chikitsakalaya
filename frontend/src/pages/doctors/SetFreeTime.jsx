import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaClock, FaPlus, FaTrash } from "react-icons/fa";
import DoctorLayout from "../../layouts/DoctorLayout";

const SetFreeTime = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const [weeklySchedule, setWeeklySchedule] = useState(
        Object.fromEntries(daysOfWeek.map(day => [day, []]))
    );
    const [selectedDay, setSelectedDay] = useState("Sunday");
    const [viewDay, setViewDay] = useState("Sunday");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [appointmentType, setAppointmentType] = useState("online");
    const [showModal, setShowModal] = useState(false);
    const [pendingSlot, setPendingSlot] = useState(null);

    const API_URL = "http://localhost:5000/api"; // Adjust if needed

    // Convert 24-hour to 12-hour format
    const convertTo12Hour = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    };

    // Convert 12-hour to 24-hour format for backend
    const convertTo24Hour = (timeStr) => {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":").map(Number);
        
        if (modifier === "PM" && hours !== 12) hours += 12;
        if (modifier === "AM" && hours === 12) hours = 0;
        
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:00`;
    };

    // Fetch time slots
    useEffect(() => {
        const fetchTimeSlots = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`${API_URL}/show/time-slot`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data.success) {
                    const updatedSchedule = Object.fromEntries(daysOfWeek.map(day => [day, []]));
                    response.data.timeSlots.forEach(slot => {
                        updatedSchedule[slot.day].push({
                            startTime: convertTo12Hour(slot.startTime),
                            endTime: convertTo12Hour(slot.endTime),
                            appointmentType: slot.appointmentType
                        });
                    });
                    setWeeklySchedule(updatedSchedule);
                }
                console.log("Fetched time slots:", response.data.timeSlots);
                
            } catch (error) {
                console.error("Error fetching time slots:", error.response?.data || error.message);
            }
        };

        fetchTimeSlots();
    }, []);

    const handleStartTimeChange = (e) => {
        const time = e.target.value;
        setStartTime(`${time} AM`); // Default to AM, user can change via UI if needed
        const [hours, minutes] = time.split(":").map(Number);
        const newEndTime = new Date(2024, 0, 1, hours, minutes + 60).toTimeString().slice(0, 5);
        setEndTime(`${newEndTime} AM`);
    };

    const addSlot = () => {
        if (startTime && endTime && appointmentType) {
            setPendingSlot({ startTime, endTime, appointmentType });
            setShowModal(true);
        }
    };

    const confirmAddSlot = async (repeatForWeek) => {
        const slotsToSend = repeatForWeek
            ? daysOfWeek.map(day => ({
                day,
                startTime: convertTo24Hour(pendingSlot.startTime),
                endTime: convertTo24Hour(pendingSlot.endTime),
                appointmentType: pendingSlot.appointmentType
            }))
            : [{
                day: selectedDay,
                startTime: convertTo24Hour(pendingSlot.startTime),
                endTime: convertTo24Hour(pendingSlot.endTime),
                appointmentType: pendingSlot.appointmentType
            }];

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/add/time-slot`, slotsToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (response.data.success) {
                const updatedSchedule = { ...weeklySchedule };
                response.data.data.forEach(slot => {
                    updatedSchedule[slot.day].push({
                        startTime: convertTo12Hour(slot.startTime),
                        endTime: convertTo12Hour(slot.endTime),
                        appointmentType: slot.appointmentType
                    });
                });
                setWeeklySchedule(updatedSchedule);
            }
        } catch (error) {
            console.error("Error adding time slot:", error.response?.data || error.message);
            alert(error.response?.data.message || "Failed to add time slot");
        }

        setShowModal(false);
        setPendingSlot(null);
        setStartTime("");
        setEndTime("");
    };

    const removeSlot = async (day, index) => {
        const slot = weeklySchedule[day][index];
        try {
            const token = localStorage.getItem("token");
            const response = await axios.delete(`${API_URL}/remove/time-slot`, {
                headers: { Authorization: `Bearer ${token}` },
                data: {
                    day,
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    appointmentType: slot.appointmentType
                }
            });

            if (response.data.success) {
                setWeeklySchedule({
                    ...weeklySchedule,
                    [day]: weeklySchedule[day].filter((_, i) => i !== index),
                });
            }
        } catch (error) {
            console.error("Error removing time slot:", error.response?.data || error.message);
            alert(error.response?.data.message || "Failed to remove time slot");
        }
    };

    return (
        <DoctorLayout>
            <div className="w-11/12 m-auto mt-8 flex gap-10">
                <div className="w-2/5 bg-white border-2 border-gray-200 shadow-sm rounded-lg p-6">
                    <h1 className="text-2xl text-gray-700 font-bold mb-6">Set Consultation Hours</h1>
                    
                    <label className="block text-gray-700 font-medium mb-2">Select Day</label>
                    <select 
                        className="w-full border-gray-300 border rounded-md p-2 mb-4" 
                        value={selectedDay} 
                        onChange={(e) => setSelectedDay(e.target.value)}
                    >
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>

                    <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                    <input 
                        type="time" 
                        className="w-full border-gray-300 border rounded-md p-2 mb-4" 
                        value={startTime.split(" ")[0] || ""} 
                        onChange={handleStartTimeChange} 
                    />

                    <label className="block text-gray-700 font-medium mb-2">End Time</label>
                    <input 
                        type="time" 
                        className="w-full border-gray-300 border rounded-md p-2 mb-4" 
                        value={endTime.split(" ")[0] || ""} 
                        onChange={(e) => setEndTime(`${e.target.value} AM`)} 
                    />

                    <label className="block text-gray-700 font-medium mb-2">Appointment Type</label>
                    <select 
                        className="w-full border-gray-300 border rounded-md p-2 mb-4" 
                        value={appointmentType} 
                        onChange={(e) => setAppointmentType(e.target.value)}
                    >
                        <option value="online">Online</option>
                        <option value="physical">Physical</option>
                    </select>

                    <button 
                        className="w-full bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-orange-600 transition duration-200 flex items-center justify-center gap-2" 
                        onClick={addSlot}
                    >
                        <FaPlus /> Add Time Slot
                    </button>
                </div>

                <div className="w-3/5 bg-white border-2 border-gray-200 shadow-sm rounded-lg p-6">
                    <h1 className="text-2xl text-gray-700 font-bold mb-6">Consultation Schedule</h1>
                    <label className="block text-gray-700 font-medium mb-2">View Slots for</label>
                    <select 
                        className="w-5/12 border-gray-300 border rounded-md p-2 mb-4" 
                        value={viewDay} 
                        onChange={(e) => setViewDay(e.target.value)}
                    >
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>

                    <ul className="space-y-2">
                        <p>Schedule for {viewDay}</p>
                        {weeklySchedule[viewDay]?.length ? weeklySchedule[viewDay].map((slot, index) => (
                            <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                <span className="flex items-center gap-2">
                                    <FaClock className="text-gray-500" />
                                    {slot.startTime} - {slot.endTime} ({slot.appointmentType})
                                </span>
                                <button 
                                    className="text-red-500 hover:text-red-700" 
                                    onClick={() => removeSlot(viewDay, index)}
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        )) : <p className="text-gray-500">No slots set for {viewDay}.</p>}
                    </ul>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <h2 className="text-xl font-bold">Confirm Time Slot</h2>
                            <p>Do you want to repeat this slot for the whole week?</p>
                            <div className="flex gap-4 mt-4">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => confirmAddSlot(true)}
                                >
                                    Yes, Repeat for Week
                                </button>
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => confirmAddSlot(false)}
                                >
                                    No, Only for {selectedDay}
                                </button>
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default SetFreeTime;