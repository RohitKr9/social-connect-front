// src/components/UserDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Comments from "./Comment";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const UserDetail = () => {
  const { id } = useParams(); // user_id from URL
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch user profile by id
        const resProfile = await fetch(
          `${BASE_URL}/profile/api/users/${id}/`,
          { headers: getAuthHeaders(), method: "GET" }
        );
        if (!resProfile.ok) throw new Error("Profile fetch failed");
        const profileData = await resProfile.json();
        setProfile(profileData.profile);

      } catch (err) {
        console.error(err);
        setMsg("Failed to load user profile");
      }
    }
    fetchData();
  }, [id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
      <div className="text-center">
        {profile.avatar && (
          <img
            src={profile.avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
          />
        )}
        <h2 className="text-xl font-bold text-gray-800">{profile.username}</h2>
        {profile.bio && <p className="text-gray-600 mt-2 text-sm">{profile.bio}</p>}
        {profile.website && (
          <a
            href={profile.website}
            className="text-gray-600 hover:underline block mt-1 text-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            {profile.website}
          </a>
        )}
        <div className="mt-3 flex justify-center gap-6 text-sm text-gray-600">
          <span className="flex flex-col items-center">
            <b className="text-gray-800">{profile.post_count}</b> Posts
          </span>
          <span className="flex flex-col items-center">
            <b className="text-gray-800">{profile.followers_count}</b> Followers
          </span>
          <span className="flex flex-col items-center">
            <b className="text-gray-800">{profile.following_count}</b> Following
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
