import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Register = () => {

  const [formData, setFormData] = useState({
    "first_name": '',
    "last_name": '',
    "username": '',
    "email": '',
    "password": ''
  });
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`${BASE_URL}/auth/api/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setMessage(data.message || 'Registration successful! Please verify your email.');
      if (response.ok) navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage('Error registering. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      />
      <button
        onClick={handleRegister}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
      <p className="mt-4 text-center">
        Already have an account?{' '}
        <button
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      </p>
      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default Register;