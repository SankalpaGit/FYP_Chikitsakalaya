import React, { useState } from "react";
import PatientLayout from "../../layouts/PatientLayout";
import HeroSection from "../../components/patients/home/HeroSection";
import HCW from "../../components/patients/home/HCW";
import FilterSearched from "../../components/patients/home/FilterSearched";
import DisplaySearched from "../../components/patients/home/DisplaySearched";

const HomePage = () => {
    const [isSearched, setIsSearched] = useState(false);

    return (
        <PatientLayout>
            <HeroSection onSearch={() => setIsSearched(true)} />

            {/* Show this section only after search */}
            {isSearched && (
                <div className="flex w-10/12 bg-white m-auto py-5 mt-2 gap-6 justify-between">
                    <FilterSearched />
                    <DisplaySearched />
                </div>
            )}

            <HCW />
        </PatientLayout>
    );
};

export default HomePage;
