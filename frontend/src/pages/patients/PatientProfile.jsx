import React from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaMale, FaBirthdayCake, FaEye } from 'react-icons/fa';
import PatientLayout from '../../layouts/PatientLayout';

const PatientProfile = () => {
    return (
        <PatientLayout>
            <div className="flex flex-col lg:flex-row p-6 gap-6 mt-10 items-stretch">
                
                <div className="w-full lg:w-5/12 p-4">
                    {/* Image and Details */}
                    <div className="flex justify-between mb-4 bg-white shadow-md rounded-md p-5 border border-gray-300 ">
                        <div className="w-36 h-40 bg-gray-200 rounded-md">
                            <img src="" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-center w-8/12 space-y-2">
                            <h1 className="text-xl font-bold">Sankalpa Shrestha</h1>
                            <p className="flex items-center text-gray-600">
                                <FaEnvelope className="mr-2" /> joshisankalpa@gmail.com
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaMapMarkerAlt className="mr-2" /> Ramdhuni 05- Jhumka
                            </p>
                            <p className="flex items-center text-gray-600">
                                <FaPhoneAlt className="mr-2" /> 980258877
                            </p>
                            <div className="flex justify-between w-8/12">
                                <p className="flex items-center text-gray-600">
                                    <FaMale className="mr-2" /> Male
                                </p>
                                <p className="flex items-center text-gray-600">
                                    <FaBirthdayCake className="mr-2" /> 2003-06-22
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Insurance Information */}
                    <div className="bg-white  p-6 shadow-md rounded-md border border-gray-300">
                        <h1 className="text-2xl font-bold mb-2 text-teal-700">Insurance Information</h1>
                        <div className="space-y-2 ">
                            <p className="text-gray-500">
                                Insurance ID: <span className="font-semibold">2512-9652-1452</span>
                            </p>
                            <p className="text-gray-500">
                                Validity Date: <span className="font-semibold">2025-06-22</span>
                            </p>
                        </div>
                        <button className="w-full bg-teal-700 text-white font-semibold rounded-md flex items-center justify-center gap-2 p-3 hover:bg-teal-600">
                            <FaEye />
                            <span>View Insurance Paper</span>
                        </button>
                    </div>
                </div>

                {/* Right Section - Medical Background */}
                <div className="flex-grow bg-white shadow-md p-5 rounded-md flex flex-col h-fit border border-gray-300">
                    <h1 className="text-xl font-bold mb-4">Medical Background</h1>
                    {/* Medical Records */}
                    <div className="space-y-2 flex-grow">
                        <div className="bg-teal-50 p-4 rounded-md">
                            <p className="font-semibold">Disease Name:</p>
                            <p className="text-gray-600">Description or related information</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                            <p className="font-semibold">Disease Name:</p>
                            <p className="text-gray-600">Description or related information</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                            <p className="font-semibold">Disease Name:</p>
                            <p className="text-gray-600">Description or related information</p>
                        </div>
                        <div className="bg-teal-50 p-4 rounded-md">
                            <p className="font-semibold">Disease Name:</p>
                            <p className="text-gray-600">Description or related information</p>
                        </div>
                    </div>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientProfile;
