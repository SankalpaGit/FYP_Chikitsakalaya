import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import axios from "axios";

const HeroSection = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = async () => {
        if (searchQuery.trim() !== "") {
            try {
                const response = await axios.get("http://localhost:5000/api/search/doctors", {
                    params: { query: searchQuery }
                });
                console.log("Search Response:", response.data); // Log response to console
    
                // Pass the doctors array inside `response.data.data`
                onSearch(response.data.data); // Pass the actual data array
            } catch (error) {
                console.error("Search API Error:", error);
            }
        }
    };
    

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch(); // Trigger search when Enter is pressed
        }
    };

    return (
        <section className="relative flex justify-center items-center h-[75vh] w-full">
            <video
                src="./home/hero.mp4"
                autoPlay
                muted
                loop
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

            {/* Text + Search Bar */}
            <div className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[70%] lg:w-[60%] text-center px-4">
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
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="p-3 bg-teal-600 text-white rounded-full transition-all hover:scale-110 hover:bg-teal-700 focus:outline-none"
                        onClick={handleSearch}
                    >
                        <AiOutlineSearch size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
