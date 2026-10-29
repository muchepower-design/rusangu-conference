import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import LoadingSpinner from '../common/LoadingSpinner';

const DistrictManager = () => {
  const [districts, setDistricts] = useState([]);
  const [newDistrict, setNewDistrict] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDistricts = async () => {
    try {
      const res = await api.get('/users/districts');
      setDistricts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, []);

  const createDistrict = async () => {
    if (!newDistrict.trim()) return;
    await api.post('/users/districts', { name: newDistrict });
    setNewDistrict('');
    fetchDistricts();
  };

  const deleteDistrict = async (id) => {
    if (window.confirm('Delete this district? This will remove all associations.')) {
      await api.delete(`/users/districts/${id}`);
      fetchDistricts();
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Manage Districts</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newDistrict}
          onChange={(e) => setNewDistrict(e.target.value)}
          placeholder="New district name"
          className="glass-input flex-1"
        />
        <button onClick={createDistrict} className="glass-button">Add District</button>
      </div>
      <div className="glass-card p-4">
        <ul className="space-y-2">
          {districts.map(d => (
            <li key={d.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
              <span className="font-medium">{d.name}</span>
              <button onClick={() => deleteDistrict(d.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DistrictManager;