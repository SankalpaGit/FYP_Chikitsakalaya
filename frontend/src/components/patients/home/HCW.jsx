import React from 'react'
import { AiOutlineSearch, AiOutlineCheckCircle } from "react-icons/ai";
import { FaRegPaperPlane } from "react-icons/fa";
import { BsFillCalendarCheckFill } from "react-icons/bs";

const steps = [
    { icon: <AiOutlineSearch />, title: "Search Doctor", description: "Easily search for the best doctor based on specialty, ratings, and availability." },
    { icon: <FaRegPaperPlane />, title: "Send Appointment Request", description: "select suitable date and time, then submit your appointment request for approval." },
    { icon: <BsFillCalendarCheckFill />, title: "Secure Your Appointment", description: "Confirm your appointment by completing the necessary payment." },
    { icon: <AiOutlineCheckCircle />, title: "Seamless Experience", description: "Join your online consultation or visit the clinic for expert care and prescriptions." },

];

const HCW = () => {
    return (

        <section className="px-6 md:px-16 py-16 flex flex-col md:flex-row items-center w-11/12 m-auto">
            {/* Left Side: Image (Hidden on Mobile) */}
            <div className="hidden md:flex w-7/12 justify-center">
                <img
                    src="./patients/image.png"
                    alt="Doctor Consultation"
                    className="w-[85%] md:w-[80%] lg:w-[70%] "
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
    )
}

export default HCW
