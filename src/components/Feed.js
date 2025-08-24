import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatePost from './CreatePost';

const PostListCreate = ({ setView }) => {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Please log in to view posts.');
          setView('login');
          return;
        }
        const response = await fetch('http://127.0.0.1:8000/profile/api/posts/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log(data);
          console.log(data.results);
          setPosts(data.results || data); // Handle paginated or non-paginated response
        } else {
          setMessage(data.message || 'Failed to fetch posts.');
        }
      } catch (error) {
        setMessage('Error fetching posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [setView]);

  // Handle post creation
  // const handleCreatePost = async () => {
  //   if (!content.trim()) {
  //     setMessage('Post content cannot be empty.');
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       setMessage('Please log in to create a post.');
  //       setView('login');
  //       return;
  //     }
  //     const response = await fetch('http://127.0.0.1:8000/profile/api/posts/', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ content }),
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setPosts([data, ...posts]); // Add new post to the top
  //       setContent('');
  //       setMessage('Post created successfully!');
  //     } else {
  //       setMessage(data.message || 'Failed to create post.');
  //     }
  //   } catch (error) {
  //     setMessage('Error creating post. Please try again.');
  //   }


  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Posts</h2>

      {/* Create Post Section */}
      {/* <div className="mb-6">
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 mb-4 border rounded resize-none"
          rows="4"
        />
        <button
          onClick={handleCreatePost}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div> */}
      <CreatePost />
      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center">No posts available.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="p-4 bg-gray-100 rounded-lg" style={{border: '2px 2px 8px rgba(0,0,0,0.1)'}}>
              <p>-------------------------------------------------------------</p>
              <img
                src={post.image_url}
                alt="Post"
                style={{
                  width: '200px',      // fixed width
                  height: '150px',     // fixed height
                  objectFit: 'cover',  // crop & cover the box nicely
                  borderRadius: '8px', // rounded corners
                  display: 'block',    // to remove inline image spacing
                  margin: '10px', // center horizontally + bottom margin
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', // subtle shadow
                }}
              />
              <h2 className="text-gray-800">{post.content}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Posted by {post.author_username} on{' '}
                {new Date(post.created_at).toLocaleDateString()}
              </p>
              <p>-------------------------------------------------------------</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-center">
        <button
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate('/my-profile')}
        >
          My Profile
        </button>
      </p>
    </div>
  );
};

export default PostListCreate;