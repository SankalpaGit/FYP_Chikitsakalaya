import React, { useState, useEffect } from "react";
import axios from "axios";
import DoctorLayout from "../../layouts/DoctorLayout";
import { FaCamera } from "react-icons/fa";

const DoctorEditProfile = () => {
    const [basicInfo, setBasicInfo] = useState({
        firstName: "",
        lastName: "",
    });

    const [detailInfo, setDetailInfo] = useState({
        speciality: "",
        experience: "",
        consultationFee: "",
        state: "",
        country: "",
        profilePicture: "",
    });

    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem("token"); // Adjust based on your auth setup

    // Fetch existing doctor details
    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/doctor/view", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                if (response.data.success) {
                    const { doctor } = response.data;
                    setBasicInfo({
                        firstName: doctor.firstName || "",
                        lastName: doctor.lastName || "",
                    });

                    setDetailInfo({
                        speciality: doctor.speciality || "",
                        experience: doctor.experience || "",
                        consultationFee: doctor.consultationFee || "",
                        state: doctor.state || "",
                        country: doctor.country || "",
                        profilePicture: doctor.profilePicture || "",
                    });

                    if (doctor.profilePicture) {
                        setPreviewImage(`http://localhost:5000${doctor.profilePicture}`);
                    }
                }
               
                
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
    }, [token]);

    const handleBasicChange = (e) => {
        setBasicInfo({ ...basicInfo, [e.target.name]: e.target.value });
    };

    const handleDetailChange = (e) => {
        setDetailInfo({ ...detailInfo, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDetailInfo({ ...detailInfo, profilePicture: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append("speciality", detailInfo.speciality);
        formData.append("experience", detailInfo.experience);
        formData.append("consultationFee", detailInfo.consultationFee);
        formData.append("state", detailInfo.state);
        formData.append("country", detailInfo.country);

        if (detailInfo.profilePicture instanceof File) {
            formData.append("profilePicture", detailInfo.profilePicture);
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/doctor/update",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                alert("Profile updated successfully!");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DoctorLayout>
            <div className="w-11/12 p-6 -mt-8 bg-white">
                <h1 className="text-3xl font-semibold mb-6 text-teal-600">Edit Your Profile</h1>

                <div className="grid grid-cols-2 gap-16 w-full">
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
                            <label className="text-sm font-medium text-gray-700">Province</label>
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

                    {/* Right Section for Profile Picture */}
                    <div className="space-y-6">
                        <div className="relative">
                            <label className="text-sm font-medium text-gray-700">Profile Picture</label>
                            <div className="relative w-6/12 border-2 rounded-md border-gray-300">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-48 h-48 rounded-sm object-cover" />
                                ) : (
                                    <img
                                        src="https://cdn3d.iconscout.com/3d/premium/thumb/doctor-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--medical-healthcare-health-avatar-pack-people-illustrations-4715129.png?f=webp"
                                        alt="Default Profile"
                                        className="w-full h-full rounded-lg object-cover"
                                    />
                                )}
                                <label className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md cursor-pointer">
                                    <FaCamera className="text-gray-600" size={20} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        <button onClick={handleSave} className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg">
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </DoctorLayout>
    );
};

export default DoctorEditProfile;
