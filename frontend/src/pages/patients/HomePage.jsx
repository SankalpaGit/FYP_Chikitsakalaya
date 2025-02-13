import React, { useState, useEffect } from "react";
import { AiOutlineSearch, AiOutlineCheckCircle } from "react-icons/ai";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import PatientLayout from "../../layouts/PatientLayout";

const HomePage = () => {
    const steps = [
        { id: 1, name: "Search", icon: <AiOutlineSearch size={30} />, desc: "Find doctors by specialty, name, or location." },
        { id: 2, name: "Select", icon: <AiOutlineCheckCircle size={30} />, desc: "Choose the best doctor based on reviews and availability." },
        { id: 3, name: "Send", icon: <FaRegPaperPlane size={30} />, desc: "Send an appointment request for approval." },
        { id: 4, name: "Set", icon: <BsFillCalendarCheckFill size={30} />, desc: "Confirm and set your appointment date." }
    ];

    const tips = [
        "Drinking water before a checkup can improve accuracy in tests!",
        "Regular checkups help detect diseases early and improve treatment outcomes.",
        "Booking appointments online saves time and ensures availability.",
        "Virtual consultations are great for follow-ups and minor health concerns."
    ];

    const [tipOfTheDay, setTipOfTheDay] = useState("");

    useEffect(() => {
        setTipOfTheDay(tips[Math.floor(Math.random() * tips.length)]);
    }, []);

    return (
        <PatientLayout>
            {/* Hero Section */}
            <div className="flex justify-center items-center h-[60vh] w-full relative">
                <img
                    src="https://img.freepik.com/free-vector/telemedicine-cartoon-header-title-horizontal-composition-with-heartbeat-stethoscope-online-medical-advice-tablet-smartphone-illustration_1284-65729.jpg?t=st=1739460692~exp=1739464292~hmac=e6df731813e8760a0ba3d4abf6e0a3f7ba4ed4d76117c73a298a5118f76c7bfc&w=1380"
                    alt="Doctors"
                    className="w-full h-full object-cover object-bottom"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gray-100 bg-opacity-5"></div>

                {/* Search Bar */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60%] mt-24">
                    <div className="flex items-center bg-white rounded-full shadow-2xl px-4 border-4 border-teal-700">
                        <input
                            type="text"
                            placeholder="Search doctor by name, specialty..."
                            className="w-full p-4 text-lg text-gray-700 bg-transparent border-none focus:ring-0 outline-none rounded-full focus:font-bold placeholder:font-normal"
                        />
                        <button className="p-3 bg-teal-600 text-white rounded-full transition-all hover:scale-110 hover:bg-teal-700 focus:outline-none">
                            <AiOutlineSearch size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* 4S Booking Steps */}
            <div className="flex flex-col items-center my-10">
                <h2 className="text-2xl font-semibold mb-4">How It Works - The 4S Process</h2>
                <div className="flex justify-center gap-6 md:gap-10">
                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center">
                            <div className="relative group">
                                <div className="p-4 bg-teal-600 text-white rounded-full">{step.icon}</div>
                                <div className="absolute bottom-[-2.5rem] text-center bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all">
                                    {step.desc}
                                </div>
                            </div>
                            <p className="mt-2 text-sm font-medium">{step.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tip of the Day & Payment Partners */}
            <div className="bg-gray-100 py-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-xl font-semibold mb-2">💡 Tip of the Day</h3>
                    <p className="text-gray-700 italic">{tipOfTheDay}</p>
                </div>

                {/* Payment Partners */}
                <div className="flex justify-center gap-6 mt-6">
                    <img src="/payments/paypal.png" alt="PayPal" className="w-20 h-auto" />
                    <img src="/payments/stripe.png" alt="Stripe" className="w-20 h-auto" />
                    <img src="/payments/visa.png" alt="Visa" className="w-20 h-auto" />
                </div>
            </div>
        </PatientLayout>
    );
};

export default HomePage;
