import React, { useState } from 'react';
import { FaHospital, FaUserMd, FaClipboardList, FaFlag, FaAddressCard, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { GrUserExpert } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

const DisplaySearched = ({ searchResults }) => {
    const [activeDoctor, setActiveDoctor] = useState(null);
    const [activeTab, setActiveTab] = useState(null);
    const navigate = useNavigate();

    const defaultProfilePic = "https://cdn3d.iconscout.com/3d/premium/thumb/doctor-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--medical-medicine-profession-pack-people-icons-8179550.png?f=webp";

    const toggleTab = (doctorId, tab) => {
        if (activeDoctor === doctorId && activeTab === tab) {
            setActiveDoctor(null);
            setActiveTab(null);
        } else {
            setActiveDoctor(doctorId);
            setActiveTab(tab);
        }
    };

    // Function to check if the image URL is valid
    const isValidImageUrl = (url) => {
        return url && (url.startsWith('http') || url.startsWith('https'));
    };

    return (
        <div className='w-9/12 m-auto bg-white shadow-lg border-2 rounded-2xl border-gray-300 px-6 py-6 h-fit'>
            {searchResults?.length > 0 ? (
                searchResults.map((doctor) => {
                    const doctorDetails = doctor.doctorDetails?.[0] || {};  // Access the first element of doctorDetails array
                    const profilePicUrl = doctorDetails.profilePicture
                        ? `http://localhost:5000/${doctorDetails.profilePicture.replace(/\\/g, '/')}` 
                        : defaultProfilePic;

                    return (
                        <div key={doctor.id} className="mb-6">
                            <div className='w-full flex items-start'>
                                <div className='w-3/12 h-38 object-cover'>
                                    <img
                                        src={profilePicUrl}
                                        alt="Doctor Avatar"
                                        className='w-full h-full rounded-lg'
                                    />
                                </div>
                                <div className='w-6/12 p-5'>
                                    <p className='font-bold text-gray-700 text-xl'>
                                        {doctor.firstName} {doctor.lastName}
                                    </p>
                                    <p className='text-gray-700 font-semibold'>{doctorDetails.speciality}</p>
                                    <div className='flex items-center mt-5 gap-2'>
                                        <span className='font-semibold text-teal-600'>charge</span>
                                        <p className='text-orange-600 font-bold text-xl'>Rs {doctorDetails.consultationFee}</p>
                                        <span className='ml-2 font-semibold text-gray-500'>per hour</span>
                                    </div>
                                    
                                </div>
                                <div className='w-2/12 flex flex-col items-center h-44'>
                                    <button
                                        className='bg-orange-600 py-3 px-3 text-white rounded-md mt-6'
                                        onClick={() => navigate(`/appointment/${doctor.id}`)}
                                    >
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
                                                <p className="text-gray-500 ml-3">{doctorDetails.experience} years</p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaEnvelope className="text-gray-600 mr-3" />
                                                <p className="font-semibold text-gray-700">Email :</p>
                                                <p className="text-gray-500 ml-3">{doctor.email}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaMapMarkerAlt className="text-gray-600 mr-3" />
                                                <p className="font-semibold text-gray-700">District, Province :</p>
                                                <p className="text-gray-500 ml-3"> {doctorDetails.state}</p>
                                            </div>
                                            <div className="flex items-center">
                                                <FaFlag className="text-gray-600 mr-3" />
                                                <p className="font-semibold text-gray-700">Country :</p>
                                                <p className="text-gray-500 ml-3">{doctorDetails.country}</p>
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
                    );
                })
            ) : (
                <p className="text-red-500 text-center w-full font-semibold">No doctors found. Please try again.</p>
            )}
        </div>
    );
};

export default DisplaySearched;
