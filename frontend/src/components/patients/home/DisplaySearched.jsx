import React, { useState } from 'react';
import { FaHospital, FaUserMd, FaClipboardList, FaFlag, FaAddressCard, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { CiHospital1 } from "react-icons/ci";
import { GrUserExpert } from "react-icons/gr";

const DisplaySearched = ({ searchResults }) => {
    const [activeDoctor, setActiveDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState(null);

    const defaultProfilePic = "https://cdn3d.iconscout.com/3d/premium/thumb/doctor-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--medical-medicine-profession-pack-people-icons-8179550.png?f=webp";

    const toggleTab = (doctorId, tab) => {
        if (activeDoctor === doctorId) {
            // If the same doctor is clicked, toggle the tab
            setActiveTab(activeTab === tab ? null : tab);
        } else {
            // If a different doctor is clicked, open the 'details' tab by default
            setActiveDoctor(doctorId);
            setActiveTab(tab);
        }
    };

    return (
        <div className='w-8/12 bg-white shadow-lg border-2 rounded-2xl border-gray-300 px-6 py-6 h-fit'>
            {searchResults?.length > 0 ? (
                searchResults.map((doctor) => (
                    <div key={doctor.id} className="mb-6">
                        <div className='w-full flex items-start'>
                            <div className='w-3/12 h-38 object-cover'>
                                <img
                                    src={doctor.doctorDetail.profilePicture || defaultProfilePic}
                                    alt="Doctor Avatar"
                                    className='w-full h-full rounded-lg'
                                />
                            </div>
                            <div className='w-6/12 p-5'>
                                <p className='font-bold text-gray-700 text-xl'>
                                    {doctor.firstName} {doctor.lastName}
                                </p>
                                <p className='text-gray-700 font-semibold'>{doctor.doctorDetail.speciality}</p>
                                <div className='flex items-center mt-5'>
                                    <p className='text-orange-600 font-bold text-xl'>Rs {doctor.doctorDetail.consultationFee}</p>
                                    <span className='ml-2 font-semibold text-gray-500'>per hour</span>
                                </div>
                                <div className='flex items-center mt-8 text-gray-700'>
                                    <FaHospital className='text-orange-600 mr-2 text-2xl' />
                                    <p>{doctor.doctorDetail.hospitalAffiliation}</p>
                                </div>
                            </div>
                            <div className='w-2/12 flex flex-col items-center h-44'>
                                <button className='bg-orange-600 py-3 px-3 text-white rounded-md mt-6'>
                                    Book Now
                                </button>
                                <p
                                    className='text-orange-500 text-lg font-semibold underline mt-auto cursor-pointer'
                                    onClick={() => toggleTab(doctor.id, 'details')}
                                >
                                    View More
                                </p>
                            </div>
                        </div>

                        {/* Expandable Details */}
                        {activeDoctor === doctor.id && (
                            <div className="h-fit bg-white w-full p-5">
                                <div className="h-0.5 w-full bg-gray-300 my-5"></div>
                                <div className="flex space-x-8 mb-5">
                                    <p
                                        className={`flex items-center cursor-pointer ${activeTab === 'details' ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                                        onClick={() => toggleTab(doctor.id, 'details')}
                                    >
                                        <FaUserMd className="mr-2" /> Doctor Details
                                    </p>
                                    <p
                                        className={`flex items-center cursor-pointer ${activeTab === 'rules' ? 'font-bold text-orange-600' : 'text-gray-600'}`}
                                        onClick={() => toggleTab(doctor.id, 'rules')}
                                    >
                                        <FaClipboardList className="mr-2" /> Appointment Rules
                                    </p>
                                </div>

                                {activeTab === 'details' && (
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <FaAddressCard className="text-xl text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">NMC number :</p>
                                            <p className="text-gray-500 ml-3">{doctor.licenseNumber}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <GrUserExpert className="text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">Years of Experience :</p>
                                            <p className="text-gray-500 ml-3">{doctor.doctorDetail.experience} years</p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">Email :</p>
                                            <p className="text-gray-500 ml-3">{doctor.email}</p>
                                        </div>
                                        <div className="h-0.5 w-full bg-gray-300"></div>
                                        <div className="flex items-center">
                                            <CiHospital1 className="text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">Hospital Address :</p>
                                            <p className="text-gray-500 ml-3">{doctor.doctorDetail.address}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaMapMarkerAlt className="text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">District, Province :</p>
                                            <p className="text-gray-500 ml-3">{doctor.doctorDetail.city}, {doctor.doctorDetail.state}</p>
                                        </div>
                                        <div className="flex items-center">
                                            <FaFlag className="text-gray-600 mr-3" />
                                            <p className="font-semibold text-gray-700">Country :</p>
                                            <p className="text-gray-500 ml-3">{doctor.doctorDetail.country}</p>
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
                                            <p className="text-gray-700">In case of extra time, additional charges apply</p>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                            <p className="text-gray-700">For physical consultations, a digital token is mandatory</p>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="text-4xl text-teal-700 mr-3">•</strong>
                                            <p className="text-gray-700">No refunds for missed appointments</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p className="text-red-500 text-center w-full font-semibold">No doctors found. Please try again.</p>
            )}
        </div>
    );
};

export default DisplaySearched;