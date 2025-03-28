import React, { useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import HeroSection from "../../components/patients/home/HeroSection";
import HCW from "../../components/patients/home/HCW";
import FilterSearched from "../../components/patients/home/FilterSearched";
import DisplaySearched from "../../components/patients/home/DisplaySearched";
import { FaStethoscope, FaUserMd, FaHeartbeat, FaTooth, FaEye, FaBrain, FaLungs, FaBone,  FaBaby, FaXRay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const departments = [
    { name: "General Medicine", icon: <FaStethoscope />, path: "/general" },
    { name: "Cardiology", icon: <FaHeartbeat />, path: "/cardiology" },
    { name: "Neurology", icon: <FaBrain />, path: "/neurology" },
    { name: "Dentistry", icon: <FaTooth />, path: "/dentistry" },
    { name: "Ophthalmology", icon: <FaEye />, path: "/ophthalmology" },
    { name: "General Physician", icon: <FaUserMd />, path: "/physician" },
    { name: "Pulmonology", icon: <FaLungs />, path: "/pulmonology" },
    { name: "Orthopedics", icon: <FaBone />, path: "/orthopedics" },
    { name: "Pediatrics", icon: <FaBaby />, path: "/pediatrics" },
    { name: "Radiology", icon: <FaXRay />, path: "/radiology" },
];

const HomePage = () => {
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [noResultsMessage, setNoResultsMessage] = useState(false);
    const navigate = useNavigate();
    const [startIndex, setStartIndex] = useState(0);
    const visibleCount = 6;

    const handlePrev = () => {
        setStartIndex((prev) => (prev - visibleCount < 0 ? 0 : prev - visibleCount));
    };

    const handleNext = () => {
        setStartIndex((prev) => (prev + visibleCount >= departments.length ? prev : prev + visibleCount));
    };



    const handleSearch = (results) => {
        console.log("Search Results:", results); // Check the received data

        // Ensure results is always an array
        const validResults = Array.isArray(results) ? results : [];

        setIsSearched(true);
        setSearchResults(validResults);

        // Log state after update
        console.log("Updated searchResults state:", validResults);

        // Show "No doctors found" message if results are empty
        if (validResults.length === 0) {
            setNoResultsMessage(true);
        } else {
            setNoResultsMessage(false);
        }
    };



    return (
        <PatientLayout>
            <HeroSection onSearch={handleSearch} />

            {isSearched && (
                <div className="flex w-10/12 bg-white m-auto py-5 mt-2 gap-6 justify-between">
                    {searchResults.length > 0 ? (
                        <>
                            <FilterSearched />
                            <DisplaySearched searchResults={searchResults} />
                        </>
                    ) : (
                        noResultsMessage && (
                            <p className="text-red-500 text-center text-2xl w-full font-bold">
                                No Searched Doctor Found.
                            </p>
                        )
                    )}
                </div>
            )}

            <HCW />

            <div className="relative w-full flex flex-col items-center p-8 bg-teal-50">
                <div className="flex w-8/12 m-auto justify-between items-center mb-4 ">
                    <button onClick={handlePrev} disabled={startIndex === 0} className="p-2 bg-teal-500 text-white rounded-full shadow-md ">
                        <FaChevronLeft className="text-xl " />
                    </button>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-14 flex-1 ">
                        {departments.slice(startIndex, startIndex + visibleCount).map((dept, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center m-auto p-6 w-32 h-32 bg-white rounded-xl shadow-lg border hover:shadow-2xl
                                cursor-pointer transition duration-300"
                                onClick={() => navigate(dept.path)}
                            >
                                <div className="text-5xl text-teal-600 mb-2">{dept.icon}</div>
                                <span className="text-sm font-semibold text-center">{dept.name}</span>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleNext} disabled={startIndex + visibleCount >= departments.length} className="p-2 bg-teal-500 text-white rounded-full shadow-md ">
                        <FaChevronRight className="text-xl" />
                    </button>
                </div>
            </div>

        </PatientLayout>
    );
};

export default HomePage;
