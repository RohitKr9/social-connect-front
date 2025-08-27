import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/api/password-reset/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent to your email.');
        setError('');
      } else {
        setError(data.error || 'Unable to process password reset.');
        setMessage('');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('An error occurred. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>
      <input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleReset}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Send Reset Link
      </button>
      <p className="mt-4 text-center">
        Remembered your password?{' '}
        <button
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </p>
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordReset;
