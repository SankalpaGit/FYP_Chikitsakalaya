import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import NavBar from '../../components/nav/NavBar';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [step1Data, setStep1Data] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [step2Data, setStep2Data] = useState({
    firstName: '',
    lastName: '',
    licenceNumber: '',
    licenceDocument: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAcceptingTerms, setIsAcceptingTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Clean up preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    setStep1Data((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStep2Change = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'licenceDocument') {
      const file = files[0];
      setStep2Data((prevData) => ({
        ...prevData,
        [name]: file,
      }));
      if (file) {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    } else if (name === 'isAcceptingTerms') {
      setIsAcceptingTerms(checked);
    } else {
      setStep2Data((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setMessage('');

    // Step 1 validation
    if (!step1Data.email || !step1Data.password || !step1Data.confirmPassword) {
      setMessage('All fields are required');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    if (step1Data.password !== step1Data.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    if (step1Data.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
      return;
    }

    // Proceed to step 2
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    // Step 2 validation
    if (!step2Data.firstName || !step2Data.lastName || !step2Data.licenceNumber || !step2Data.licenceDocument) {
      setMessage('All fields are required');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
      return;
    }
    if (!isAcceptingTerms) {
      setMessage('You must accept the terms and conditions');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
      return;
    }

    const form = new FormData();
    form.append('email', step1Data.email);
    form.append('password', step1Data.password);
    form.append('firstName', step2Data.firstName);
    form.append('lastName', step2Data.lastName);
    form.append('licenceNumber', step2Data.licenceNumber);
    form.append('licenceDocument', step2Data.licenceDocument);

    try {
      const response = await axios.post('http://localhost:5000/api/doctors/register', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage('Registration successful!');
      setMessageColor('text-green-600');
      setTimeout(() => navigate('/doctor/login'), 1500);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 1500);
    }
  };

  const handleBack = () => {
    setStep(1);
    setMessage('');
  };

  const handleViewLicense = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col lg:flex-row h-screen bg-white">
        <div className="hidden lg:flex lg:w-1/2 h-screen justify-center items-center ml-11">
          <img src="/doctor/signup_doctor.jpeg" alt="Signup" className="w-[90%] h-[98%] object-contain" />
        </div>

        <div className="flex justify-center items-center w-full lg:w-1/2 p-8">
          <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-gray-200 border-2" onSubmit={step === 1 ? handleNextStep : handleRegister}>
            <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">Register As Doctor</h2>
            {message && <p className={`text-center mb-4 ${messageColor}`}>{message}</p>}

            {step === 1 ? (
              <>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  onChange={handleStep1Change}
                  value={step1Data.email}
                  className="w-full p-3 border rounded-lg mb-4"
                  required
                />
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    onChange={handleStep1Change}
                    value={step1Data.password}
                    className="w-full p-3 border rounded-lg mb-4"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                <div className="relative">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    onChange={handleStep1Change}
                    value={step1Data.confirmPassword}
                    className="w-full p-3 border rounded-lg mb-6"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                  </button>
                </div>
                <button type="submit" className="w-full bg-teal-700 text-white py-3 rounded-lg">
                  Next
                </button>
              </>
            ) : (
              <>
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  onChange={handleStep2Change}
                  value={step2Data.firstName}
                  className="w-full p-3 border rounded-lg mb-4"
                  required
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  onChange={handleStep2Change}
                  value={step2Data.lastName}
                  className="w-full p-3 border rounded-lg mb-4"
                  required
                />
                <input
                  name="licenceNumber"
                  type="text"
                  placeholder="Licence Number"
                  onChange={handleStep2Change}
                  value={step2Data.licenceNumber}
                  className="w-full p-3 border rounded-lg mb-4"
                  required
                />
                <div className="relative mb-4">
                  <input
                    name="licenceDocument"
                    type="file"
                    onChange={handleStep2Change}
                    className="w-full p-3 border rounded-lg"
                    required
                  />
                  {step2Data.licenceDocument && (
                    <button
                      type="button"
                      onClick={handleViewLicense}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      aria-label="View license document"
                    >
                      <AiOutlineEye size={20} />
                    </button>
                  )}
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="isAcceptingTerms"
                    checked={isAcceptingTerms}
                    onChange={handleStep2Change}
                    className="h-5 w-5 accent-teal-600 mr-2"
                  />
                  <label htmlFor="isAcceptingTerms" className="text-gray-600">
                    I accept the{' '}
                    <a href="/terms" className="text-teal-700 hover:underline">
                      Terms and Conditions
                    </a>
                  </label>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={!isAcceptingTerms}
                    className={`w-2/3 py-3 rounded-lg ${
                      isAcceptingTerms
                        ? 'bg-teal-700 text-white hover:bg-teal-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Register as Doctor
                  </button>
                </div>
              </>
            )}

            <p className="text-center mt-4">
              Already registered As Doctor ?{' '}
              <a href="/doctor/login" className="text-teal-700 font-bold">
                Login
              </a>
            </p>
          </form>
        </div>
      </div>

      {/* Modal for License Preview */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-teal-700">License Preview</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close modal"
              >
                &times;
              </button>
            </div>
            {step2Data.licenceDocument && previewUrl ? (
              step2Data.licenceDocument.type.startsWith('image/') ? (
                <img
                  src={previewUrl}
                  alt="License document"
                  className="w-full h-auto max-h-[60vh] object-contain"
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Non-image files cannot be previewed directly.
                  </p>
                  <a
                    href={previewUrl}
                    download={step2Data.licenceDocument.name}
                    className="bg-teal-700 text-white py-2 px-4 rounded-lg hover:bg-teal-600"
                  >
                    Download {step2Data.licenceDocument.name}
                  </a>
                </div>
              )
            ) : (
              <p className="text-gray-600">No file selected.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;