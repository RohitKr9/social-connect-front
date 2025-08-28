import { useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const FollowButton = ({ targetUserId, isInitiallyFollowing=false }) => {
  const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleToggleFollow = async () => {
    if (!token) {
      alert("Login required");
      return;
    }

    setLoading(true);

    try {
      const url = isFollowing
        ? `${BASE_URL}/profile/api/users/unfollow/`
        : `${BASE_URL}/profile/api/users/follow/`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ following: targetUserId }),
      });

      if (!res.ok) throw new Error("Failed to toggle follow");

      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
  onClick={handleToggleFollow}
  className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
    isFollowing
      ? "bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400"
      : "bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400"
  } disabled:cursor-not-allowed`}
  disabled={loading}
>
  {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
</button>
    // <button
    //   onClick={handleToggleFollow}
    //   className={`mt-2 px-4 py-2 rounded text-white ${
    //     isFollowing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
    //   }`}
    //   disabled={loading}
    // >
    //   {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    // </button>
  );
};

export default FollowButton;