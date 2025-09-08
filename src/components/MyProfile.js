// src/components/MyProfile.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications";
import Comments from "./Comment";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const MyProfile = () => {
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [msg, setMsg] = useState("");

    const navigate = useNavigate();
    // Helper to get auth token from localStorage
    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        // console.log("Using token:", token);
        return token
            ? { Authorization: `Bearer ${token}` }
            : {};
    };

    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch user profile
                const resProfile = await fetch(
                    `${BASE_URL}/profile/api/users/me`,
                    {
                        headers: getAuthHeaders(),
                        method: 'POST',
                    }
                );
                if (!resProfile.ok) throw new Error("Profile fetch failed");
                const profileData = await resProfile.json();
                setProfile(profileData.profile);

                // Fetch user's posts
                const resPosts = await fetch(
                    `${BASE_URL}/profile/api/users/myposts/`,
                    {
                        headers: getAuthHeaders(),
                        method: 'GET',
                    }
                );
                if (!resPosts.ok) throw new Error("Posts fetch failed");
                const postsData = await resPosts.json();
                setPosts(postsData);
            } catch (err) {
                console.error(err);
                setMsg("Failed to load profile");
            }
        }
        fetchData();
    }, []);

    useEffect(() => { }, [profile]);


    const handleLogout = async () => {
        try {
            await fetch(`${BASE_URL}/profile/api/logout/`, {
                method: "POST",
                headers: getAuthHeaders(),
            });
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            window.location.href = "/login";
        } catch (err) {
            setMsg("Logout failed");
        }
    };

    const handleFeed = async (e) => {
        e.preventDefault();
        try {
            navigate('/feed');
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    const handleFollowing = async (e) => {
        e.preventDefault();
        try {
            navigate('/following');
        } catch (err) {
            console.error('Login error:', err);
        }
    }

    const handleFollowers = async (e) => {
        e.preventDefault();
        try {
            navigate('/followers');
        } catch (err) {
            console.error('Login error:', err);
        }
    }

    const handleExplorePeople = async (e) => {
        e.preventDefault();
        try {
            navigate('/explore-people');
        } catch (err) {
            console.error('Login error:', err);
        }
    }

    const handleEditProfile = async (e) => {
        e.preventDefault();
        try {
            navigate('/create-profile');
        } catch (err) {
            console.error('Login error:', err);
        }
    }

    if (!profile) return <div>Loading...</div>;
    return (
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto mt-10">
            {/* <Notifications userId={profile.user_id} /> */}
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
                        <b className="text-gray-800">{profile.followers_count}</b>
                        <button onClick={handleFollowers} className="text-gray-800 hover:underline">
                            Followers
                        </button>
                    </span>
                    <span className="flex flex-col items-center">
                        <b className="text-gray-800">{profile.following_count}</b>
                        <button onClick={handleFollowing} className="text-gray-800 hover:underline">
                            Followings
                        </button>
                    </span>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    onClick={handleFeed}
                    className="bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Feed
                </button>
                <button
                    onClick={handleExplorePeople}
                    className="bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Explore People
                </button>
                <button
                    onClick={handleEditProfile}
                    className="bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Edit Profile
                </button>
                <button
                    onClick={handleLogout}
                    className="bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                    Logout
                </button>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mt-6 mb-4">Posts</h3>
            {posts.length === 0 ? (
                <p className="text-center text-gray-600">No posts available.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li key={post.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                            <hr className="border-gray-300 mb-4" />
                            {post.image_url && (
                                <img
                                    src={post.image_url}
                                    alt="Post"
                                    className="w-48 h-36 object-cover rounded-md block mx-auto mb-4 shadow-sm"
                                />
                            )}
                            <p className="text-gray-800 font-medium">
                                {post.title || post.content || "Untitled Post"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                Posted by {post.author_username} on{' '}
                                {new Date(post.created_at).toLocaleDateString()}
                            </p>
                            <Comments postId={post.id} />
                            <hr className="border-gray-300 mt-4" />
                        </li>
                    ))}
                </ul>
            )}
            {msg && <p className="text-red-500 text-sm mt-4 text-center">{msg}</p>}
        </div>
    );
};

export default MyProfile;

