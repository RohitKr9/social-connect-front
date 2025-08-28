import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log('Attempting to log in with:', { email, password });
      const response = await axios.post(`${BASE_URL}/auth/api/token/`, {
        email,
        password,
      });

      console.log('Login response:', response.data);
      const { access } = response.data;
      const token = access;
      console.log('Login successful:', token);

      localStorage.setItem('token', token);

      navigate('/my-profile');
    } catch (err) {
      setError('Invalid email or password');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h2>
  {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      />
    </div>
    <button
      type="submit"
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
    >
      Login
    </button>
  </form>
  <p className="text-sm text-gray-600 mt-4 text-center">Don't have an account?</p>
  <button
    onClick={() => window.location.href = '/register'}
    className="w-full bg-white text-gray-800 py-2 mt-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
  >
    Register
  </button>
</div>
    // <div>
    //   <h2>Login</h2>
    //   {error && <p style={{ color: 'red' }}>{error}</p>}
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label htmlFor="email">Email:</label>
    //       <input 
    //         type="email" 
    //         id="email" 
    //         name="email" 
    //         required 
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password:</label>
    //       <input 
    //         type="password" 
    //         id="password" 
    //         name="password" 
    //         required 
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //       />
    //     </div>
    //     <button type="submit">Login</button>
    //   </form>
    //   <p>Not having account</p>
    //   <button onClick={() => window.location.href = '/register'}>Register</button>
    // </div>
  );
};

export default Login;
