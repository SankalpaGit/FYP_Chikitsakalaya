import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyEmail, loginAdmin } from '../../services/adminLoginService';
import NavBar from '../../components/nav/Navbar';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [message, setMessage] = useState(''); // State for displaying messages
  const navigate = useNavigate();

  // Step 1: Verify if the email exists
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('Verifying admin email...'); // Display verifying message

    try {
      const exists = await verifyEmail(email);
      if (exists) {
        // Simulate 2+2 seconds delay (4 seconds total)
        setTimeout(() => {
          setMessage('Email verified'); // Update message after 2 seconds
          setTimeout(() => {
            setEmailVerified(true);
            setStep(2);
            setMessage(''); // Clear message after verification
          }, 2000); // Additional 2 seconds
        }, 2000); // First 2 seconds
      } else {
        setMessage(''); // Clear message
        setError('Email not found.');
      }
    } catch (err) {
      setMessage(''); // Clear message
      setError(err.message || 'An error occurred.');
    }
  };

  // Step 2: Handle login with password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('Logging in...'); // Optional: Display logging in message

    try {
      const token = await loginAdmin(email, password);
      localStorage.setItem('token', token);
      const expirationTime = Date.now() + 10 * 1000;
      localStorage.setItem('tokenExpiry', expirationTime.toString());

      // Display welcome message for 2 seconds before navigating
      setMessage('Welcome Admin');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 2000); // 2 seconds delay
    } catch (err) {
      setMessage(''); // Clear message
      setError(err.message || 'Invalid credentials.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 via-teal-200 to-blue-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105">
          <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">Admin Login</h2>

          {message && (
            <p className="text-center text-teal-600 font-semibold">{message}</p>
          )}

          {step === 1 ? (
            <form onSubmit={handleEmailSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm text-gray-600">
                  Enter Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none"
                  placeholder="admin@example.com"
                  required
                />
              </div>

              {error && <p className="text-red-600 mt-4">{error}</p>}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-800 focus:outline-none transition-colors"
                  disabled={message === 'Verifying admin email...'} // Disable button during verification
                >
                  Verify Email
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm text-gray-600">
                  Enter Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-md focus:outline-none"
                  placeholder="********"
                  required
                />
              </div>

              {error && <p className="text-red-600 mt-4">{error}</p>}

              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-800 focus:outline-none transition-colors"
                  disabled={message === 'Logging in...'} // Disable button during login
                >
                  Login as Admin
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLogin;