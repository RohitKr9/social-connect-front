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
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>
  {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
  <form className="space-y-4">
    <div>
      <input
        type="text"
        name="first_name"
        placeholder="First Name"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <div>
      <input
        type="text"
        name="last_name"
        placeholder="Last Name"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <div>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <div>
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <button
      type="button"
      onClick={handleRegister}
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
    >
      Register
    </button>
  </form>
  <p className="text-sm text-gray-600 mt-4 text-center">
    Already have an account?{' '}
    <button
      onClick={() => navigate('/login')}
      className="text-gray-800 font-medium hover:underline"
    >
      Login
    </button>
  </p>
</div>
    // <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
    //   <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
    //   <input
    //     type="text"
    //     name="first_name"
    //     placeholder="First Name"
    //     value={formData.first_name}
    //     onChange={handleChange}
    //     className="w-full p-2 mb-4 border rounded"
    //   />
    //   <input
    //     type="text"
    //     name="last_name"
    //     placeholder="Last Name"
    //     value={formData.last_name}
    //     onChange={handleChange}
    //     className="w-full p-2 mb-4 border rounded"
    //   />
    //   <input
    //     type="text"
    //     name="username"
    //     placeholder="Username"
    //     value={formData.username}
    //     onChange={handleChange}
    //     className="w-full p-2 mb-4 border rounded"
    //   />
    //   <input
    //     type="email"
    //     name="email"
    //     placeholder="Email"
    //     value={formData.email}
    //     onChange={handleChange}
    //     className="w-full p-2 mb-4 border rounded"
    //   />
    //   <input
    //     type="password"
    //     name="password"
    //     placeholder="Password"
    //     value={formData.password}
    //     onChange={handleChange}
    //     className="w-full p-2 mb-4 border rounded"
    //   />
    //   <button
    //     onClick={handleRegister}
    //     className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    //   >
    //     Register
    //   </button>
    //   <p className="mt-4 text-center">
    //     Already have an account?{' '}
    //     <button
    //       className="text-blue-500 cursor-pointer"
    //       onClick={() => navigate('/login')}
    //     >
    //       Login
    //     </button>
    //   </p>
    //   {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    // </div>
  );
};

export default Register;