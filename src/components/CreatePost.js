import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; 

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CreatePost = () => {
  const [formData, setFormData] = useState({
    content: '',
    image: null,
    category: 'general',
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `posts/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCreatePost = async () => {
    if (!formData.content.trim()) {
      setMessage('Post content cannot be empty.');
      return;
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in to create a post.');
        navigate('/login');
        return;
      }

      let image_url = '';
      if (formData.image) {
        image_url = await uploadImageToSupabase(formData.image);
      }

      const payload = {
        content: formData.content,
        image_url,
        category: formData.category,
      };

      const response = await fetch(`${BASE_URL}/profile/api/posts/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Post created successfully!');
        setFormData({ content: '', image: null, category: 'general' });
        setTimeout(() => navigate('/feed'), 1000); // Change route as needed
      } else {
        setMessage(data.message || 'Failed to create post.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error creating post. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a Post</h2>
  {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
  <div className="space-y-4">
    <textarea
      name="content"
      placeholder="What's on your mind?"
      value={formData.content}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400 resize-none"
      rows="4"
      maxLength="280"
    />
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
    />
    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
    >
      <option value="general">General</option>
      <option value="announcement">Announcement</option>
      <option value="question">Question</option>
    </select>
    <button
      onClick={handleCreatePost}
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      disabled={uploading}
    >
      {uploading ? 'Creating Post...' : 'Create Post'}
    </button>
  </div>
</div>
  );
};

export default CreatePost;
