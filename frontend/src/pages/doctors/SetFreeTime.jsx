import React, { useState } from "react";
import { FaClock, FaPlus, FaTrash } from "react-icons/fa";
import DoctorLayout from "../../layouts/DoctorLayout";

const SetFreeTime = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    const [weeklySchedule, setWeeklySchedule] = useState(
        Object.fromEntries(daysOfWeek.map(day => [day, []]))
    );
    const [selectedDay, setSelectedDay] = useState("Sunday");
    const [viewDay, setViewDay] = useState("Sunday");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [pendingSlot, setPendingSlot] = useState(null);

    const convertTo12Hour = (time) => {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    };

    
    const handleStartTimeChange = (e) => {
        const time = e.target.value;
        setStartTime(time);
        const [hours, minutes] = time.split(":").map(Number);
        const newEndTime = new Date(2024, 0, 1, hours, minutes + 60).toTimeString().slice(0, 5);
        setEndTime(newEndTime);
    };

    const addSlot = () => {
        if (startTime && endTime) {
            setPendingSlot({ startTime, endTime });
            setShowModal(true);
        }
    };

    const confirmAddSlot = (repeatForWeek) => {
        let updatedSchedule = { ...weeklySchedule };
        if (repeatForWeek) {
            daysOfWeek.forEach(day => {
                updatedSchedule[day] = [
                    ...updatedSchedule[day],
                    {
                        startTime: convertTo12Hour(pendingSlot.startTime),
                        endTime: convertTo12Hour(pendingSlot.endTime),
                    },
                ];
            });
        } else {
            updatedSchedule[selectedDay] = [
                ...updatedSchedule[selectedDay],
                {
                    startTime: convertTo12Hour(pendingSlot.startTime),
                    endTime: convertTo12Hour(pendingSlot.endTime),
                },
            ];
        }
        setWeeklySchedule(updatedSchedule);
        setShowModal(false);
        setPendingSlot(null);
        setStartTime("");
        setEndTime("");
    };

    const removeSlot = (day, index) => {
        setWeeklySchedule({
            ...weeklySchedule,
            [day]: weeklySchedule[day].filter((_, i) => i !== index),
        });
    };

    return (
        <DoctorLayout>
            <div className="w-11/12 m-auto mt-8 flex gap-10">
                <div className="w-2/5 bg-white border-2 border-gray-200 shadow-sm rounded-lg p-6">
                    <h1 className="text-2xl text-gray-700 font-bold mb-6">Set Consultation Hours</h1>
                    <label className="block text-gray-700 font-medium mb-2">Select Day</label>
                    <select className="w-full border-gray-300 border rounded-md p-2 mb-4" value={selectedDay} onChange={(e) => setSelectedDay(e.target.value)}>
                        {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                    <label className="block text-gray-700 font-medium mb-2">Start Time</label>
                    <input type="time" className="w-full border-gray-300 border rounded-md p-2 mb-4" value={startTime} onChange={handleStartTimeChange} />
                    <label className="block text-gray-700 font-medium mb-2">End Time</label>
                    <input type="time" className="w-full border-gray-300 border rounded-md p-2 mb-4" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                    <button className="w-full bg-orange-500 text-white font-medium py-2 rounded-md hover:bg-orange-600 transition duration-200 flex items-center justify-center gap-2" onClick={addSlot}>
                        <FaPlus /> Add Time Slot
                    </button>
                </div>

                <div className="w-3/5 bg-white border-2 border-gray-200 shadow-sm rounded-lg p-6">
                    <div className="flex justify-between  w-full">
                        <div className="w-5/12 ">
                            <h1 className="text-2xl text-gray-700 font-bold mb-6">Consultation Schedule</h1>
                        </div>
                        <div className="flex w-4/12 justify-between items-center">
                            <label className="block text-gray-700 font-medium mb-2 items-center">View Slots for</label>
                            <select className="w-5/12 border-gray-300 border rounded-md p-2 mb-4 items-center" value={viewDay} onChange={(e) => setViewDay(e.target.value)}>
                                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                    </div>


                    <ul className="space-y-2">
                        <p>Schedule for {viewDay}</p>
                        {weeklySchedule[viewDay]?.length ? weeklySchedule[viewDay].map((slot, index) => (
                            
                            <li key={index} className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                                <span className="flex items-center gap-2">
                                    <FaClock className="text-gray-500" />
                                    {slot.startTime} - {slot.endTime}
                                </span>
                                <button className="text-red-500 hover:text-red-700" onClick={() => removeSlot(viewDay, index)}>
                                    <FaTrash />
                                </button>
                            </li>
                        )) : <p className="text-gray-500">No slots set for {viewDay}.</p>}
                    </ul>
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center ">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-4">Repeat Time Slot?</h2>
                        <p>Would you like to repeat this time for the whole week (Sunday to Friday)?</p>
                        <div className="flex justify-end gap-4 mt-4">
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-md" onClick={() => confirmAddSlot(false)}>No</button>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-md" onClick={() => confirmAddSlot(true)}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
        </DoctorLayout>
    );
};

export default SetFreeTime;
