import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 

const BASE_URL = process.env.REACT_APP_BASE_URL;

const FollowersList = ({ setView }) => {
  const [followers, setFollowers] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch followers list on component mount
  useEffect(() => {
    const fetchFollowers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view your followers.');
          setView('login');
          return;
        }
        const response = await fetch(`${BASE_URL}/profile/api/users/follower/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFollowers(data); // Expecting an array of followers
        } else {
          setMessage(data.message || 'Failed to fetch followers.');
        }
      } catch (error) {
        setMessage('Error fetching followers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [setView]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Followers</h2>
  {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
  {/* Back Button */}
  <div className="mb-6">
    <button
      onClick={() => navigate('/my-profile')}
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
    >
      Back to Posts
    </button>
  </div>
  {/* Followers List Section */}
  {loading ? (
    <p className="text-center text-gray-600">Loading followers...</p>
  ) : followers.length === 0 ? (
    <p className="text-center text-gray-600">You have no followers.</p>
  ) : (
    <div className="space-y-4">
      {followers.map((follower) => (
        <div
          key={follower.id}
          className="p-4 bg-gray-50 border border-gray-200 rounded-md"
        >
          <div className="flex items-center space-x-3">
                <img
                  src={follower.avatar}
                  alt={`${follower.username || 'Unknown User'} avatar`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-800 font-medium">
                  {follower.username || 'Unknown User'}
                </p>
              </div>
        </div>
      ))}
    </div>
  )}
</div>);
  
};

export default FollowersList;