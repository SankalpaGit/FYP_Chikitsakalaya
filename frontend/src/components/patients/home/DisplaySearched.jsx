import React, { useState } from 'react';
import { FaHospital } from 'react-icons/fa';
import { FaUserMd, FaClipboardList,  FaFlag, FaAddressCard } from 'react-icons/fa'; // FontAwesome Icons
import { FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { CiHospital1 } from "react-icons/ci";
import { GrUserExpert } from "react-icons/gr";

const DisplaySearched = () => {
    const [activeTab, setActiveTab] = useState(null);

    return (
        <div className='w-8/12 bg-white shadow-lg border-2 rounded-2xl border-gray-300 px-6 py-6 h-fit'>
            <div className='w-full flex  items-start'>
                <div className='w-3/12 h-38 object-cover'>
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/doctor-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--medical-medicine-profession-pack-people-icons-8179550.png?f=webp"
                        alt="Doctor Avatar"
                        className='w-full h-full '
                    />
                </div>
                <div className='w-6/12 p-5'>
                    <p className='font-bold xl text-gray-700'>Sankalpa Shrestha</p>
                    <div className=' items-center mt-1'>
                        <p className='text-gray-700 font-semibold'>Cardiologist</p>
                        <div className='flex items-center mt-5'>
                            <p className='text-orange-600 font-bold text-xl'>Rs 255</p>
                            <span className='ml-2 font-semibold text-gray-500'>per hour</span>
                        </div>
                    </div>
                    <div className='flex items-center mt-8 text-gray-700'>
                        <FaHospital className='text-orange-600 mr-2 text-2xl' />
                        <p>Nobel Hospital</p>
                    </div>
                </div>
                <div className='w-2/12 flex flex-col items-center  h-44'>
                    <button className='bg-orange-600 py-3 px-3 text-white rounded-md mt-6'>Book Now</button>
                    <p
                        className='text-orange-500 text-lg font-semibold underline mt-auto cursor-pointer'
                        onClick={() => setActiveTab(activeTab === null ? 'details' : null)}
                    >
                        View More
                    </p>
                </div>
            </div>

            {activeTab && (
                <div className="h-fit bg-white w-full p-5 ">
                    <div className="h-0.5 w-full bg-gray-300 my-5"></div>
                    <div className="flex space-x-8 mb-5">
                        <p
                            className={`flex items-center cursor-pointer ${activeTab === 'details' ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('details')}
                        >
                            <FaUserMd className="mr-2" /> Doctor Details
                        </p>
                        <p
                            className={`flex items-center cursor-pointer ${activeTab === 'rules' ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                            onClick={() => setActiveTab('rules')}
                        >
                            <FaClipboardList className="mr-2" /> Appointment Rules
                        </p>
                    </div>

                    {activeTab === 'details' && (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <FaAddressCard className="text-xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">NMC number :</p>
                                <p className="text-gray-500 ml-3">123456789</p>
                            </div>
                            {/* Year of Experience */}
                            <div className="flex items-center">
                                <GrUserExpert className="xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">Year of experience :</p>
                                <p className="text-gray-500 ml-3">3 years</p>
                            </div>

                            {/* Email */}
                            <div className="flex items-center">
                                <FaEnvelope className="xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">Email :</p>
                                <p className="text-gray-500 ml-3">doctorTest@gmail.com</p>
                            </div>

                            <div className='h-0.5 w-full bg-gray-300'></div>

                            {/* Doctor Address */}
                            <div className="flex items-center">
                                <CiHospital1 className="xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">Hospital Address :</p>
                                <p className="text-gray-500 ml-3">Kanchanbari, Biratnagar 4</p>
                            </div>

                            {/* City, State */}
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">District, Province :</p>
                                <p className="text-gray-500 ml-3">Morang, Koshi</p>
                            </div>

                            {/* Country */}
                            <div className="flex items-center">
                                < FaFlag className="xl text-gray-600 mr-3" />
                                <p className="font-semibold text-gray-700">Country :</p>
                                <p className="text-gray-500 ml-3">Nepal</p>
                            </div>
                        </div>
                    )}
                    {activeTab === 'rules' && (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                <p className="text-gray-700">Cannot cancel the appointment on the appointment day</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                <p className="text-gray-700">The fee shown is valid only for one hour</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                <p className="text-gray-700">In case of extra time, the charge will be added</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                <p className="text-gray-700">For physical consultations or checkups, a digital token is compulsory</p>
                            </div>
                            <div className="flex items-center">
                                <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                <p className="text-gray-700">No refunds will be made if the appointment date is missed</p>
                            </div>
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}

export default DisplaySearched;