import React from "react";
import { AiOutlineSearch, AiOutlineCheckCircle } from "react-icons/ai";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillCalendarCheckFill } from "react-icons/bs";
import PatientLayout from "../../layouts/PatientLayout";

const steps = [
    { icon: <AiOutlineSearch />, title: "Search Doctor", description: "Easily search for the best doctor based on specialty, ratings, and availability." },
    { icon: <FaRegPaperPlane />, title: "Send Appointment Request", description: "select suitable date and time, then submit your appointment request for approval." },
    { icon: <BsFillCalendarCheckFill />, title: "Secure Your Appointment", description: "Confirm your appointment by completing the necessary payment." },
    { icon: <AiOutlineCheckCircle />, title: "Seamless Experience", description: "Join your online consultation or visit the clinic for expert care and prescriptions." },

];

const HomePage = () => {
    return (
        <PatientLayout>

            {/* Hero Section */}
            <section className="relative flex justify-center items-center h-[75vh] w-full">
                <video
                    src="./home/hero.mp4"
                    autoPlay
                    muted
                    loop
                    className="w-full h-full object-cover "
                />
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

                {/* Text + Search Bar */}
                <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4">
                    {/* Tagline */}
                    <h1 className="text-white text-3xl md:text-5xl font-extrabold drop-shadow-lg leading-tight">
                        We promise to digitalize Nepal's <br /> <span className="text-orange-400 mt-4 block">HealthCare</span>
                    </h1>
                    <p className="text-white text-lg md:text-xl font-medium mt-5 drop-shadow-md">
                        Chikitsakalaya is here to transform healthcare through digital innovation.
                    </p>

                    {/* Search Bar */}
                    <div className="mt-12 flex items-center bg-white rounded-full shadow-2xl px-4 border-4 border-teal-700">
                        <input
                            type="text"
                            placeholder="Search doctor by name, specialty..."
                            className="w-full p-4 text-lg text-gray-700 bg-transparent border-none focus:ring-0 outline-none rounded-full focus:font-semibold placeholder:font-normal"
                        />
                        <button className="p-3 bg-teal-600 text-white rounded-full transition-all hover:scale-110 hover:bg-teal-700 focus:outline-none">
                            <AiOutlineSearch size={24} />
                        </button>
                    </div>
                </div>
            </section>




            <section className="px-6 md:px-16 py-16 flex flex-col md:flex-row items-center ">
                {/* Left Side: Image (Hidden on Mobile) */}
                <div className="hidden md:flex w-7/12 justify-center">
                    <img
                        src="./patients/image.png"
                        alt="Doctor Consultation"
                        className="w-[80%] md:w-[70%] lg:w-[60%] "
                    />
                </div>

                {/* Right Side: Steps */}
                <div className="w-full md:w-5/12 mt-8 md:mt-0 md:ml-8 ">
                    <h2 className="text-3xl sm:text-4xl font-bold text-teal-700 mb-6 ">How Chikitsakalaya works</h2>
                    <ul className="space-y-6">
                        {steps.map((step, index) => (
                            <li key={index} className="flex items-start space-x-4">
                                <div className="text-teal-600 text-3xl">{step.icon}</div>
                                <div>
                                    <h3 className="text-xl font-semibold text-teal-700">{step.title}</h3>
                                    <p className="text-gray-600 text-sm">{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </PatientLayout>
    );
};

export default HomePage;
