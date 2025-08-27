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
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Followings</h2>

      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/my-profile')}
          className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
        >
          Back to Posts
        </button>
      </div>

      {/* Following List Section */}
      {loading ? (
        <p className="text-center">Loading followings...</p>
      ) : followings.length === 0 ? (
        <p className="text-center">You are not following anyone.</p>
      ) : (
        <div className="space-y-4">
          {followings.map((following) => (
            <div key={following.id} className="p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-800 font-medium">
                {following.username || 'Unknown User'}
                {console.log('Follower:', following)}
              {console.log('Follower ID:', following.id)}
              <FollowButton
                    targetUserId={following.id}
                    isInitiallyFollowing={true}
                />
              </p>
            </div>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-center text-red-500">{message}</p>}
    </div>
  );
};

export default FollowingList;