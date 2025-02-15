import React from "react";
import PatientLayout from "../../layouts/PatientLayout";
import HeroSection from "../../components/patients/home/HeroSection";
import HCW from "../../components/patients/home/HCW";



const HomePage = () => {
    return (
        <PatientLayout>
            < HeroSection />
            < HCW />
        </PatientLayout>
    );
};

export default HomePage;
