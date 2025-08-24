import { useState } from "react";

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
        ? `http://127.0.0.1:8000/profile/api/users/unfollow/`
        : `http://127.0.0.1:8000/profile/api/users/follow/`;

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
      className={`mt-2 px-4 py-2 rounded text-white ${
        isFollowing ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
      disabled={loading}
    >
      {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;