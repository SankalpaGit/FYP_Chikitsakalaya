import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import NavBar from '../../components/nav/NavBar';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('text-red-600');
  const navigate = useNavigate();

  // Manual login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful');
      setMessageColor('text-green-600');
      setTimeout(() => {
        setMessage('');
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Login error:', error);
      setMessage('Login failed');
      setMessageColor('text-red-600');
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Google login handler
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5173/api/auth/google';
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row items-center justify-evenly min-h-screen bg-white p-4">
        <div className="w-5/12 flex justify-center">
          <img src="/patients/auth.png" alt="Login" />
        </div>
        <div className="w-5/12 max-w-md bg-white shadow-lg rounded-lg p-6 border-2 border-gray-100">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <p className={`text-center mt-2 ${messageColor}`}>{message}</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white font-semibold py-2 rounded-md hover:bg-teal-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-300"
            >
              <FcGoogle className="mr-2 text-xl" /> Sign in with Google
            </button>
          </form>
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-teal-600 hover:underline">
              Register now
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginForm;