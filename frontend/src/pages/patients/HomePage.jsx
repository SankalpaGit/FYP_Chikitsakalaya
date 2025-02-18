import React, { useState } from "react";
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
        </PatientLayout>
    );
};

export default HomePage;
