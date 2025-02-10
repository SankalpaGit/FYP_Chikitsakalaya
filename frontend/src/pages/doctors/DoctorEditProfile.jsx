import React, { useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import { FaCamera } from 'react-icons/fa';

const DoctorEditProfile = () => {
    const [basicInfo, setBasicInfo] = useState({
        firstName: '',
        lastName: '',
        licenseNumber: '',
        certificate: '',
    });

    const [detailInfo, setDetailInfo] = useState({
        speciality: '',
        experience: '',
        consultationFee: '',
        hospitalAffiliation: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        profilePicture: '',
    });

    const handleBasicChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo({
            ...basicInfo,
            [name]: value,
        });
    };

    const handleDetailChange = (e) => {
        const { name, value } = e.target;
        setDetailInfo({
            ...detailInfo,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setDetailInfo({
            ...detailInfo,
            profilePicture: file,
        });
    };

    const handleCertificateChange = (e) => {
        const file = e.target.files[0];
        setBasicInfo({
            ...basicInfo,
            certificate: file,
        });
    };

    return (
        <DoctorLayout>
            <div className="w-11/12 p-6 -mt-8 bg-white">
                <h1 className="text-3xl font-semibold mb-6 text-teal-600">Edit Your Profile</h1>

                {/* Profile Section */}
                <div className="grid grid-cols-2 gap-16  w-full">

                    {/* Left Section for Input Fields */}
                    <div className="space-y-6">
                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={basicInfo.firstName}
                                onChange={handleBasicChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="Sankalpa"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={basicInfo.lastName}
                                onChange={handleBasicChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="Shrestha"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">License Number</label>
                            <input
                                type="text"
                                name="licenseNumber"
                                value={basicInfo.licenseNumber}
                                onChange={handleBasicChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="ABCD1234"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Speciality</label>
                            <input
                                type="text"
                                name="speciality"
                                value={detailInfo.speciality}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="Cardiology"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Experience (Years)</label>
                            <input
                                type="number"
                                name="experience"
                                value={detailInfo.experience}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="5"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Consultation Fee</label>
                            <input
                                type="number"
                                name="consultationFee"
                                value={detailInfo.consultationFee}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="$50"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Hospital Affiliation</label>
                            <input
                                type="text"
                                name="hospitalAffiliation"
                                value={detailInfo.hospitalAffiliation}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="City Hospital"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                name="address"
                                value={detailInfo.address}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="123 Main St"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">City</label>
                            <input
                                type="text"
                                name="city"
                                value={detailInfo.city}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="New York"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">State</label>
                            <input
                                type="text"
                                name="state"
                                value={detailInfo.state}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="NY"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Zip Code</label>
                            <input
                                type="text"
                                name="zipCode"
                                value={detailInfo.zipCode}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="10001"
                            />
                        </div>

                        <div className="input-card relative">
                            <label className="text-sm font-medium text-gray-700">Country</label>
                            <input
                                type="text"
                                name="country"
                                value={detailInfo.country}
                                onChange={handleDetailChange}
                                className="border border-gray-200 rounded-lg px-3 py-2 w-full focus:outline-none focus:border-teal-500"
                                placeholder="USA"
                            />
                        </div>
                    </div>

                    {/* Right Section for Image Upload */}
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Certificate</label>
                            <div className="relative w-10/12 " >
                                {basicInfo.certificate ? (
                                    <img
                                        src={URL.createObjectURL(basicInfo.certificate)}
                                        alt="Certificate"
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                    />
                                ) : (
                                    <img
                                        src="https://cdn.venngage.com/template/thumbnail/small/5bdeb833-5514-4c2d-9d67-b269371bb924.webp"
                                        alt="Default Certificate"
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                    />
                                )}
                                {/* Camera Icon for Upload */}
                                <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md cursor-pointer flex items-center justify-center">
                                    <FaCamera className="text-gray-600" size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCertificateChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                            <div className="relative w-6/12 border-2 rounded-md border-gray-300">
                                {detailInfo.profilePicture ? (
                                    <img
                                        src={URL.createObjectURL(detailInfo.profilePicture)}
                                        alt="Profile"
                                        className="w-48 h-48 rounded-sm object-cover shadow-lg"
                                    />
                                ) : (
                                    <img
                                        src="https://cdn3d.iconscout.com/3d/premium/thumb/doctor-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--medical-healthcare-health-avatar-pack-people-illustrations-4715129.png?f=webp"
                                        alt="Default Profile"
                                        className="w-full h-full rounded-lg object-cover shadow-lg"
                                    />
                                )}
                                {/* Camera Icon for Upload */}
                                <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md cursor-pointer flex items-center justify-center">
                                    <FaCamera className="text-gray-600" size={20} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className=''>
                        <button className=" bg-orange-500 mt-10 text-white px-6 py-3 rounded-lg text-lg float-right">
                                Save Changes
                            </button>
                        </div>         
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorEditProfile;
