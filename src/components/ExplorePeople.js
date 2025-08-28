import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ExplorePeople = ({ setView }) => {
  const [usersToFollow, setUers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch following list on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view Users to follow.');
          setView('login');
          return;
        }
        const response = await fetch(`${BASE_URL}/profile/api/users/profile-list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUers(data); // Expecting an array of followings
        } else {
          setMessage(data.message || 'Failed to fetch Users.');
        }
      } catch (error) {
        setMessage('Error fetching Users. Please try again.');
      } finally {
        setLoading(false);
      }
    };


    fetchUsers();
  }, [setView]);

  useEffect(() => { }, [usersToFollow]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Users You May Know</h2>
      {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/my-profile')}
          className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Back to Profile
        </button>
      </div>
      {/* Users List Section */}
      {loading ? (
        <p className="text-center text-gray-600">Loading Users...</p>
      ) : usersToFollow.length === 0 ? (
        <p className="text-center text-gray-600">No users to follow</p>
      ) : (
        <div className="space-y-4">
          {usersToFollow.map((user) => (
            <div
              key={user.id}
              className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={`${user.username || 'Unknown User'} avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-800 font-medium">
                  {user.username || 'Unknown User'}
                </p>
              </div>

              <FollowButton
                targetUserId={user.id}
                isInitiallyFollowing={false}
              />
            </div>
          ))}
        </div>
      )}
    </div>
   
  );
};

export default ExplorePeople;