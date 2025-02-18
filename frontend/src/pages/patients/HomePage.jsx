import React, { useState, useEffect } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import HeroSection from "../../components/patients/home/HeroSection";
import HCW from "../../components/patients/home/HCW";
import FilterSearched from "../../components/patients/home/FilterSearched";
import DisplaySearched from "../../components/patients/home/DisplaySearched";

const HomePage = () => {
    const [isSearched, setIsSearched] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [noResultsMessage, setNoResultsMessage] = useState(false);

    const handleSearch = (results) => {
        // Ensure results is always an array
        const validResults = Array.isArray(results) ? results : [];

        setIsSearched(true);
        setSearchResults(validResults);

        // Show "No doctors found" message if results are empty
        if (validResults.length === 0) {
            setNoResultsMessage(true);
            setTimeout(() => setNoResultsMessage(false), 10000); // Hide after 10 seconds
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
        </PatientLayout>
    );
};

export default HomePage;
