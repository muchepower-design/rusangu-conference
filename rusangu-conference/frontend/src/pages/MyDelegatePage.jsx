import React, { useState, useEffect } from 'react';
import api from '../api/client';
import Skeleton from '../components/common/Skeleton';
import { useTheme } from '../contexts/ThemeContext';

const MyDelegatePage = () => {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await api.get('/delegates/me');
        setInfo(res.data);
        // console.log('Fetched delegate info (Attendance and Meals):', res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  const downloadBadge = async () => {
    try {
      const response = await api.get(`/delegates/badges/${info.id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `badge_${info.id}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download, Your badge is not available.');
    }
  };

  /*
    const downloadBadge = async (userId) => {
    try {
      const response = await api.get(`/delegates/badges/${userId}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `badge_${userId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download badge.');
    }
  };
  */

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto glass-card p-6">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton.Text width="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton.Text width="w-1/2" height="h-4" />
            <Skeleton.Text width="w-1/3" height="h-4" />
          </div>
        </div>
        <Skeleton.Form fields={4} />
      </div>
    );
  }

  if (!info) return <div className="glass-card text-center p-8 text-red-600">Error loading delegate info</div>;

  const profileImageUrl = info.profile_picture
    ? `${baseUrl}/users/${info.profile_picture}`
    : null;

  return (
    <div className="max-w-2xl mx-auto glass-card">
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">My Delegate Information</h1>

      <div className="flex items-center space-x-6 mb-6">
        <div className="flex-shrink-0">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-sda-blue"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-3xl">
              {info.name?.[0] || '👤'}
            </div>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{info.name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{info.district || 'No district'}</p>
        </div>
      </div>

      <div className="space-y-2 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p><span className="font-semibold">Badge ID:</span> {info.badge_id || 'Not generated yet'}</p>
        <p><span className="font-semibold">Today's Attendance:</span> {info.attendance || 'Not recorded'}</p>
        <div>
          <span className="font-semibold">Meals Today:</span>
          <ul className="ml-4 list-disc">
            <li>Breakfast: {info.meals?.breakfast || 'Not recorded'}</li>
            <li>Lunch: {info.meals?.lunch || 'Not recorded'}</li>
            <li>Supper: {info.meals?.supper || 'Not recorded'}</li>
          </ul>
        </div>
        {info.badge_id && (
          <button onClick={downloadBadge} className="glass-button mt-4">📄 Download My Badge</button>
        )}
      </div>
    </div>
  );
};

export default MyDelegatePage;