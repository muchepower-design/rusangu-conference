import React, { useState, useEffect } from 'react';
import api from '../api/client';
import CampList from '../components/camps/CampList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CampsPage = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCamps = async () => {
    try {
      const res = await api.get('camps/');
      setCamps(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCamps();
  }, []);

  const handleCreate = async (data) => {
    await api.post('/camps', data);
    fetchCamps();
  };

  const handleUpdate = async (id, data) => {
    await api.put(`/camps/${id}`, data);
    fetchCamps();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this camp?')) {
      await api.delete(`/camps/${id}`);
      fetchCamps();
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400">Camps</h1>
      <CampList camps={camps} onCreate={handleCreate} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
};

export default CampsPage;