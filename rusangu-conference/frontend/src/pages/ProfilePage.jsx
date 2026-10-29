import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import Skeleton from '../components/common/Skeleton';
import { useTheme } from '../contexts/ThemeContext';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const { darkMode } = useTheme();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [pictureFile, setPictureFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/users/profile');
      setProfile(res.data);
      setFormData(res.data);
      setPreviewUrl(res.data.profile_picture ? `${baseUrl}/users/${res.data.profile_picture}` : '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPictureFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUploading(true);
    try {
      // Step 1: Update profile fields
      await api.put('/users/profile', formData);

      // Step 2: Upload new profile picture if any
      if (pictureFile) {
        const picForm = new FormData();
        picForm.append('file', pictureFile);
        await api.post('/users/profile-picture', picForm, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Step 3: Show success and exit edit mode
      setSuccess('Profile updated successfully');
      setEditing(false);

      // Step 4: Refresh local profile data
      await fetchProfile();

      // Step 5: Refresh user in AuthContext (sidebar) – but don't let it affect user feedback
      try {
        await refreshUser();
      } catch (refreshErr) {
        // Silent fail – the profile data is already updated, and the user can refresh manually if needed.
        console.warn('Could not refresh user data in sidebar', refreshErr);
      }
    } catch (err) {
      console.error('Update error:', err);
      setError(err.response?.data?.error || 'Update failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const startEditing = () => setEditing(true);
  const cancelEditing = () => {
    setEditing(false);
    setFormData(profile);
    setPreviewUrl(profile.profile_picture ? `${baseUrl}/users/${profile.profile_picture}` : '');
    setPictureFile(null);
    setError('');
    setSuccess('');
  };

  const handleImageClick = (src) => {
    if (src) {
      setShowImageModal(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <Skeleton.Form fields={6} />
      </div>
    );
  }

  if (!profile) return <div className="glass-card text-center p-8">Profile not found</div>;

  return (
    <div className="max-w-3xl mx-auto">
      {showImageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-2xl max-h-screen p-4">
            <img
              src={previewUrl || `${baseUrl}/users/${profile.profile_picture}`}
              alt="Profile"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light">My Profile</h1>
        {!editing && (
          <button onClick={startEditing} className="glass-button">
            <span className="mr-2">✏️</span> Edit Profile
          </button>
        )}
      </div>

      <div className="glass-card">
        {success && <div className="bg-green-500/20 text-green-700 dark:text-green-300 p-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500/20 text-red-700 dark:text-red-300 p-2 rounded mb-4">{error}</div>}

        {editing && (
          <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 p-2 rounded mb-4 border border-blue-300 dark:border-blue-700">
            You are editing your profile. Click Save when done.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-6">
            <div
              className="flex-shrink-0 cursor-pointer relative group"
              onClick={() => previewUrl && handleImageClick(previewUrl)}
            >
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-sda-blue hover:opacity-80 transition"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl">
                  {profile.first_name?.[0]}{profile.last_name?.[0]}
                </div>
              )}
              {previewUrl && (
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-xs font-semibold">View</span>
                </div>
              )}
            </div>
            {editing && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="glass-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="glass-button mt-2"
                >
                  Upload Photo
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">Email</label>
              <input type="email" value={profile.email} disabled className="glass-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700 dark:text-gray-300">District</label>
              <input type="text" value={profile.district || 'N/A'} disabled className="glass-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
            </div>

            {profile.entity_type && (
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300">Entity Type</label>
                <input type="text" value={profile.entity_type} disabled className="glass-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
              </div>
            )}
            {profile.entity_sub_type && (
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300">Sub Type</label>
                <input type="text" value={profile.entity_sub_type} disabled className="glass-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
              </div>
            )}
            {profile.entity_details && (
              <div className="col-span-2">
                <label className="block text-gray-700 dark:text-gray-300">Details</label>
                <input type="text" value={profile.entity_details} disabled className="glass-input w-full bg-gray-100 dark:bg-gray-700 cursor-not-allowed" />
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300">First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Middle Name</label>
              <input
                type="text"
                name="middle_name"
                value={formData.middle_name || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">Diet Preference</label>
              <select
                name="diet_preference"
                value={formData.diet_preference || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
              >
                <option value="">Select</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
                <option value="non_vegetarian">Non‑Vegetarian</option>
                <option value="pescatarian">Pescatarian</option>
                <option value="gluten_free">Gluten‑Free</option>
                <option value="dairy_free">Dairy‑Free</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">T-Shirt Size</label>
              <select
                name="tshirt_size"
                value={formData.tshirt_size || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
              >
                <option value="">Select</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="2XL">2XL</option>
                <option value="3XL">3XL</option>
                <option value="4XL">4XL</option>
                <option value="5XL">5XL</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300">T-Shirt Color</label>
              <select
                name="tshirt_color"
                value={formData.tshirt_color || ''}
                onChange={handleChange}
                disabled={!editing}
                className={`glass-input w-full transition ${editing ? 'border-sda-blue' : 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'}`}
              >
                <option value="">Select</option>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="blue">Blue</option>
                <option value="red">Red</option>
                <option value="green">Green</option>
                <option value="yellow">Yellow</option>
                <option value="orange">Orange</option>
                <option value="purple">Purple</option>
                <option value="pink">Pink</option>
                <option value="gray">Gray</option>
                <option value="navy">Navy</option>
                <option value="maroon">Maroon</option>
                <option value="teal">Teal</option>
              </select>
            </div>
          </div>

          {editing && (
            <div className="flex space-x-4 mt-4">
              <button
                type="submit"
                className="glass-button flex items-center"
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  '💾 Save Changes'
                )}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                className="glass-button bg-gray-500/80 hover:bg-gray-600/80"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;