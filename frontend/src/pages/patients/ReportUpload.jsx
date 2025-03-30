import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUpload, FaEye, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";
import PatientLayout from "../../layouts/PatientLayout";

const ReportUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileType, setFileType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setFileType(file.type);

      if (!file.type.includes("image")) {
        setUploadError("Only image files (JPG, PNG) are supported.");
        setSelectedFile(null);
        setFilePreview(null);
      } else {
        setUploadError("");
      }
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ type: "error", text: "Please select an image first." });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("report", selectedFile);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("http://localhost:5000/api/upload/Report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: "Profile updated successfully!" });

      setTimeout(() => {
        navigate("/profile");
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage({ type: "error", text: "Something went wrong in text extraction." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
    <div className="flex flex-col items-center justify-center  p-6">
      <p className="text-gray-600 text-lg mb-6">Extract text from reports to auto-fill user details</p>

      <div className="flex flex-col md:flex-row bg-white  overflow-hidden w-full max-w-4xl">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 ">
          <label
            htmlFor="file-input"
            className="cursor-pointer flex flex-col items-center justify-center w-full h-64
             bg-white text-teal-700 rounded-md shadow-md border-2 border-dashed border-teal-500 hover:bg-teal-50 transition-all"
          >
            <FaUpload className="text-4xl mb-2" />
            <span className="text-sm">Upload Report Image</span>
          </label>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

          {uploadError && (
            <div className="text-red-500 flex items-center mt-2">
              <FaExclamationTriangle className="mr-2" />
              {uploadError}
            </div>
          )}

          {filePreview && (
            <button
              className="mt-4 flex items-center bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-all"
              onClick={toggleModal}
            >
              <FaEye className="mr-2" /> Preview Report
            </button>
          )}
        </div>

        <div className="w-full md:w-1/2 p-6">
          <h3 className="text-3xl font-bold text-teal-700">How it Works ?</h3>
          <ul className="text-gray-700 list-disc ml-6 mt-2 space-y-1">
            <li>Upload a clear image of the medical report.</li>
            <li>The system extracts text and fills user details.</li>
            <li>Review extracted text and make necessary edits.</li>
            <li>Confirm and save the extracted details.</li>
          </ul>

          {loading ? (
            <button className="mt-4 w-full bg-gray-400 text-white px-4 py-2 rounded-md" disabled>
              Processing...
            </button>
          ) : (
            <button
              onClick={handleUpload}
              className="mt-4 w-full bg-teal-700 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-all"
            >
              Extract Text & Update Profile
            </button>
          )}

          {message && (
            <div
              className={`mt-4 p-3 rounded-md ${
                message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              } flex items-center`}
            >
              {message.type === "success" ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
              {message.text}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && filePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={toggleModal}>
          <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-2 right-2 text-red-700 text-2xl font-bold hover:text-red-600" onClick={toggleModal}>
              X
            </button>
            <img src={filePreview} alt="Preview" className="max-w-full max-h-96 mx-auto" />
          </div>
        </div>
      )}
    </div>
    </PatientLayout>
  );
};

export default ReportUpload;