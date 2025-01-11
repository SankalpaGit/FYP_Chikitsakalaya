import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      setMessage('Login successful!');
      navigate('/home');  // Redirect to dashboard after login
    } catch (error) {
      console.error('Login error:', error);  // Log error details to console
      setMessage('Login failed');
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
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
        </form>
        <p className="text-center mt-4 text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export default LoginForm;
