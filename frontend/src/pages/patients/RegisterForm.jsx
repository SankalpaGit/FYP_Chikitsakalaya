import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import NavBar from '../../components/nav/NavBar';

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    isAcceptingTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('text-red-600');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Password and Confirm Password do not match');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 2500); // Changed to 1.5s
      return;
    }
    if (!formData.isAcceptingTerms) {
      setMessage('You must accept the terms and conditions');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 2500); // Changed to 1.5s
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/register', formData);
      setMessage('Registration successful!');
      setMessageColor('text-green-600');
      setTimeout(() => {
        setMessage('');
        navigate('/login');
      }, 2500); // Changed to 1.5s
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage(error.response.data.message || 'Email already exists');
      } else {
        setMessage('Registration failed');
      }
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 2500); // Changed to 1.5s
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row items-center justify-evenly min-h-screen bg-white p-4">
        <div className="w-5/12 flex justify-center">
          <img src="/patients/auth.png" alt="Register" />
        </div>
        <div className="w-5/12 max-w-md bg-white shadow-lg rounded-lg p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-center mb-3">Register</h2>
          <p className={`text-center mb-4 ${messageColor}`}>{message}</p>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isAcceptingTerms"
                checked={formData.isAcceptingTerms}
                onChange={handleChange}
                className="h-5 w-5 accent-teal-600 mr-2"
              />
              <label htmlFor="isAcceptingTerms" className="text-gray-600">
                I accept the{' '}
                <a href="/terms" className="text-teal-600 hover:underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700"
            >
              Register
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-teal-600 hover:underline">
              Login now
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;