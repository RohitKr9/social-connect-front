import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  supabase  from '../supabaseClient'; // Adjust path as needed

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CreateProfile = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bio: '',
    website: '',
    profile_visibility: 'public',
    avatar: null,
  });

  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'avatar') {
      setFormData({ ...formData, avatar: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const uploadAvatarToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { data, error1 } = await supabase.storage.listBuckets();
    console.log(data); // shows all buckets
    console.log(error1); // shows error if any


    let { error } = await supabase.storage.from('images').upload(filePath, file);

    if (error) throw error;

    const { data: publicURLData } = supabase
      .storage
      .from('images')
      .getPublicUrl(filePath);

    return publicURLData.publicUrl;
  };

  const handleCreateProfile = async () => {
    setUploading(true);
    try {
      let avatar_url = null;

      // 1. Upload avatar if present
      if (formData.avatar) {
        avatar_url = await uploadAvatarToSupabase(formData.avatar);
      }

      // 2. Prepare data to send
      const payload = {
        bio: formData.bio,
        website: formData.website,
        profile_visibility: formData.profile_visibility,
        avatar:avatar_url,
      };

      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Please log in.');
        navigate('/login');
        return;
      }

      const response = await fetch(`${BASE_URL}/profile/api/users/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Profile created successfully!');
        setTimeout(() => navigate('/my-profile'), 1000);
      } else {
        setMessage(data.message || 'Failed to create profile.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error creating profile.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mx-auto mt-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create Your Profile</h2>
  {message && <p className="text-red-500 text-sm mb-4 text-center">{message}</p>}
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Bio</label>
      <textarea
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400 resize-none"
        rows="3"
        maxLength="160"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Website</label>
      <input
        type="url"
        name="website"
        value={formData.website}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder-gray-400"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Profile Visibility</label>
      <select
        name="profile_visibility"
        value={formData.profile_visibility}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-700"
      >
        <option value="public">Public</option>
        <option value="private">Private</option>
        <option value="followers_only">Followers Only</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Avatar (optional)</label>
      <input
        type="file"
        name="avatar"
        accept="image/*"
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
      />
    </div>
    <button
      type="button"
      onClick={handleCreateProfile}
      disabled={uploading}
      className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {uploading ? 'Creating Profile...' : 'Create Profile'}
    </button>
  </form>
</div>
    // <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
    //   <h2 className="text-2xl font-bold text-center mb-6">Create Your Profile</h2>

    //   <div className="mb-4">
    //     <label className="block mb-1 font-medium">Bio</label>
    //     <textarea
    //       name="bio"
    //       value={formData.bio}
    //       onChange={handleChange}
    //       className="w-full border rounded p-2"
    //       rows="3"
    //       maxLength="160"
    //     />
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1 font-medium">Website</label>
    //     <input
    //       type="url"
    //       name="website"
    //       value={formData.website}
    //       onChange={handleChange}
    //       className="w-full border rounded p-2"
    //     />
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1 font-medium">Profile Visibility</label>
    //     <select
    //       name="profile_visibility"
    //       value={formData.profile_visibility}
    //       onChange={handleChange}
    //       className="w-full border rounded p-2"
    //     >
    //       <option value="public">Public</option>
    //       <option value="private">Private</option>
    //       <option value="followers_only">Followers Only</option>
    //     </select>
    //   </div>

    //   <div className="mb-4">
    //     <label className="block mb-1 font-medium">Avatar (optional)</label>
    //     <input
    //       type="file"
    //       name="avatar"
    //       accept="image/*"
    //       onChange={handleChange}
    //       className="w-full border p-2 rounded"
    //     />
    //   </div>

    //   <button
    //     onClick={handleCreateProfile}
    //     disabled={uploading}
    //     className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
    //   >
    //     {uploading ? 'Creating Profile...' : 'Create Profile'}
    //   </button>

    //   {message && <p className="text-center text-red-500 mt-4">{message}</p>}
    // </div>
  );
};

export default CreateProfile;
