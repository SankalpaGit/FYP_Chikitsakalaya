import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
  const [step, setStep] = useState(1);
  
  // Separate states for step 1 and step 2
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
  
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const navigate = useNavigate();

  const handleStep1Change = (e) => {
    const { name, value } = e.target;
    setStep1Data((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStep2Change = (e) => {
    const { name, value } = e.target;
    if (name === 'licenceDocument') {
      setStep2Data((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
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
      return;
    }
    if (step1Data.password !== step1Data.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageColor('text-red-600');
      return;
    }
    if (step1Data.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageColor('text-red-600');
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
      return;
    }

    const allFormData = {
      email: step1Data.email,
      password: step1Data.password,
      firstName: step2Data.firstName,
      lastName: step2Data.lastName,
      licenceNumber: step2Data.licenceNumber,
      licenceDocument: step2Data.licenceDocument,
    };

    console.log('Form data:', allFormData); // This will log all form data

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
      setTimeout(() => navigate('/doctor/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
      setMessageColor('text-red-600');
    }
  };

  return (
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
              <input name="email" type="email" placeholder="Email" onChange={handleStep1Change} value={step1Data.email} className="w-full p-3 border rounded-lg mb-4" required />
              <input name="password" type="password" placeholder="Password" onChange={handleStep1Change} value={step1Data.password} className="w-full p-3 border rounded-lg mb-4" required />
              <input name="confirmPassword" type="password" placeholder="Confirm Password" onChange={handleStep1Change} value={step1Data.confirmPassword} className="w-full p-3 border rounded-lg mb-6" required />
              <button type="submit" className="w-full bg-teal-700 text-white py-3 rounded-lg">Next</button>
            </>
          ) : (
            <>
              <input name="firstName" type="text" placeholder="First Name" onChange={handleStep2Change} value={step2Data.firstName} className="w-full p-3 border rounded-lg mb-4" required />
              <input name="lastName" type="text" placeholder="Last Name" onChange={handleStep2Change} value={step2Data.lastName} className="w-full p-3 border rounded-lg mb-4" required />
              <input name="licenceNumber" type="text" placeholder="Licence Number" onChange={handleStep2Change} value={step2Data.licenceNumber} className="w-full p-3 border rounded-lg mb-4" required />
              <input name="licenceDocument" type="file" onChange={handleStep2Change} className="w-full p-3 border rounded-lg mb-6" required />
              <button type="submit" className="w-full bg-teal-700 text-white py-3 rounded-lg">Register as Doctor</button>
            </>
          )}

          <p className="text-center mt-4">Already registered As Doctor ? <a href="/doctor/login" className="text-teal-700 font-bold">Login</a></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
