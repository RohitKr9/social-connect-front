import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FollowButton from './FollowButton';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const FollowingList = ({ setView }) => {
  const [followings, setFollowings] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch following list on component mount
  useEffect(() => {
    const fetchFollowings = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view your followings.');
          setView('login');
          return;
        }
        const response = await fetch(`${BASE_URL}/profile/api/users/following/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setFollowings(data); // Expecting an array of followings
        } else {
          setMessage(data.message || 'Failed to fetch followings.');
        }
      } catch (error) {
        setMessage('Error fetching followings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    console.log(followings);

    fetchFollowings();
  }, [setView]);

  useEffect(() => {}, [followings]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Followings</h2>
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
  {/* Following List Section */}
  {loading ? (
    <p className="text-center text-gray-600">Loading followings...</p>
  ) : followings.length === 0 ? (
    <p className="text-center text-gray-600">You are not following anyone.</p>
  ) : (
    <div className="space-y-4">
      {followings.map((following) => (
        <div
          key={following.id}
          className="p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
        >
          <p className="text-gray-800 font-medium">
            {following.username || 'Unknown User'}
          </p>
          {console.log(following)}
          <FollowButton
            targetUserId={following.user_id}
            isInitiallyFollowing={true}
          />
        </div>
      ))}
    </div>
  )}
</div>
  );
};

export default FollowingList;