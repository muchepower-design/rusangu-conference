import React, { useState, useEffect } from 'react';
import api from '../api/client';
import MeetingList from '../components/meetings/MeetingList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetings = async () => {
    try {
      const res = await api.get('meetings/');
      setMeetings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async (data) => {
    await api.post('/meetings', data);
    fetchMeetings();
  };

  const handleUpdate = async (id, data) => {
    await api.put(`/meetings/${id}`, data);
    fetchMeetings();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this meeting?')) {
      await api.delete(`/meetings/${id}`);
      fetchMeetings();
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">Meetings</h1>
      <MeetingList meetings={meetings} onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
};

export default MeetingsPage;