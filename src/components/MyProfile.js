// src/components/MyProfile.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "./Notifications"; 

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
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            
            <Notifications userId={profile.user_id} />   
            <div style={{ textAlign: "center" }}>
                <img
                    src={profile.avatar}
                    alt="profile"
                    width={100}
                    height={100}
                    style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <h2>{profile.username}</h2>
                <h3>{profile.bio}</h3>
                <h3>{profile.website}</h3>
                <div>
                    <span><b>{profile.post_count}</b> Posts</span> |{""}
                    <span><b>{profile.followers_count}</b> <Link onClick={handleFollowers} >Followers</Link></span> |{""}
                    <span><b>{profile.following_count}</b> <Link onClick={handleFollowing} >Followings</Link></span> |{""}
                </div>
            </div>
            <h3 style={{ marginTop: 20 }}>Posts</h3>
            <ul>
                {posts.map((post) => (
                    <div>
                        <p>-------------------------------------------------------------</p>
                        <img
                            src={post.image_url}
                            alt="Post"
                            style={{
                                width: '200px',      
                                height: '150px',    
                                objectFit: 'cover',  
                                borderRadius: '8px', 
                                display: 'block',    
                                margin: '10px', 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                            }}
                        />
                        <li key={post.id}>{post.title || post.content || "Untitled Post"}</li></div>

                ))}
            </ul>
            <button onClick={handleFeed} style={{ marginTop: 30, width: "100%" }}>
                feed
            </button>
            <button onClick={handleExplorePeople} style={{ width: "100%" }}>
                Explore people
            </button>
            <button onClick={handleEditProfile} style={{ width: "100%" }}>
                Edit Profile
            </button>
            <button onClick={handleLogout} style={{ width: "100%" }}>
                Logout
            </button>
            <div style={{ color: "red" }}>{msg}</div>
        </div>
    );
};

export default MyProfile;

