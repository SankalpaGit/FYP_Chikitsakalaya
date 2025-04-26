import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import NavBar from '../../components/nav/Navbar';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/doctor/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Welcome Doctor'); // Optional: Display welcome message
      setTimeout(() => {
        navigate('/doctor/dashboard');
      }, 2000); // Optional: Display welcome message for 2 seconds before navigating
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'An error occurred during login');
      setTimeout(() => setError(''), 1500);
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col lg:flex-row h-screen bg-custom-bg">
        {/* Image Section */}
        <div className="hidden lg:block lg:w-1/2">
          <img
            src="/doctor/login.jpeg"
            alt="Login"
            className="object-contain w-full h-full"
          />
        </div>

        {/* Form Section */}
        <div className="flex justify-center items-center w-full lg:w-1/2 p-8 min-h-screen lg:min-h-0">
          <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md border-gray-200 border-2">
            <h2 className="text-2xl font-bold mb-6 text-teal-700 text-center">Login</h2>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {message && <p className="text-teal-500 text-center mb-4">{message}</p>}

            {/* Email and Password Fields */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="email">
                Gmail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-teal-300"
                placeholder="example@gmail.com"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:border-teal-300"
                  placeholder="********"
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
            </div>

            <button
              type="submit"
              className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-600 focus:outline-none focus:ring focus:ring-teal-300"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;