import React, { useState } from 'react';
const BASE_URL = process.env.REACT_APP_BASE_URL;

const VerifyEmail = ({ setView }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleVerify = async () => {
    try {
      const response = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Email verified successfully!');
        setView('login');
      } else {
        setMessage(data.message || 'Verification failed.');
      }
    } catch (error) {
      setMessage('Error verifying email. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Verify Email</h2>
      <p className="mb-4 text-center">Enter the verification code sent to your email.</p>
      <input
        type="text"
        placeholder="Verification Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Verify
      </button>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default VerifyEmail;