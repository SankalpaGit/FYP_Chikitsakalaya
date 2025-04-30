import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Recommendation = () => {
  const [recommendations, setRecommendations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const patientId = decoded.id;

      axios.get(`http://127.0.0.1:8000/api/recommend/?patient_id=${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.success) {
            setRecommendations(response.data.recommendations);
          }
        })
        .catch(error => {
          console.error("Error fetching recommendations:", error);
        });

    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  const defaultProfilePic = "https://cdn3d.iconscout.com/3d/premium/thumb/doctor-avatar-3d-icon-download-in-png-blend-fbx-gltf-file-formats--medical-medicine-profession-pack-people-icons-8179550.png?f=webp";

  return (
    <div className='w-11/12 mx-auto bg-white rounded-2xl px-6 py-6'>
      <h2 className='text-2xl font-bold mb-6 text-gray-700'>Recommended Doctors</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {recommendations.length > 0 ? (
          recommendations.map((doctor) => {
            const profilePicUrl = doctor.profilePicture
              ? `http://localhost:5000/${doctor.profilePicture.replace(/\\/g, '/')}`
              : defaultProfilePic;

            return (
              <div
                key={doctor.doctorId}
                className="bg-gray-100 rounded-xl shadow-md overflow-hidden border border-gray-300"
              >
                <img
                  src={profilePicUrl}
                  alt="Doctor Avatar"
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <p className="font-bold text-gray-700 text-lg">
                    {doctor.firstName} {doctor.lastName}
                  </p>
                  <p className="text-gray-600 font-medium">{doctor.speciality}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    <strong>Location:</strong> {doctor.state}, {doctor.country}
                  </p>
                  <div className="flex items-center mt-3 gap-2">
                    <span className="font-semibold text-teal-600">Charge</span>
                    <p className="text-orange-600 font-bold">Rs {doctor.consultationFee}</p>
                    <span className="text-gray-500 text-sm">/hr</span>
                  </div>
                  <button
                    className="mt-4 w-full bg-orange-600 py-2 px-3 text-white rounded-md hover:bg-orange-700 transition"
                    onClick={() => navigate(`/appointment/${doctor.doctorId}`)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-red-500 text-center font-semibold col-span-full">No recommendations available.</p>
        )}
      </div>
    </div>
  );
};

export default Recommendation;
