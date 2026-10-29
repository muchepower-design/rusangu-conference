import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminDesignationManager = () => {
  const [designations, setDesignations] = useState([]);
  const [formData, setFormData] = useState({ name: '', label: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDesignations = async () => {
    try {
      const res = await api.get('/officials/designations');
      setDesignations(res.data);
    } catch (error) {
      console.error('Error fetching designations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/officials/designations/${editing}`, formData);
      } else {
        await api.post('/officials/designations', formData);
      }
      setFormData({ name: '', label: '' });
      setEditing(null);
      fetchDesignations();
    } catch (error) {
      console.error('Error saving designation:', error);
      alert(error.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this designation?')) return;
    try {
      await api.delete(`/officials/designations/${id}`);
      fetchDesignations();
    } catch (error) {
      alert(error.response?.data?.error || 'Cannot delete designation in use');
    }
  };

  const startEdit = (des) => {
    setEditing(des.value);
    setFormData({ name: des.value, label: des.label });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Manage Designations</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Name (e.g., president)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="glass-input"
          required
        />
        <input
          type="text"
          placeholder="Label (e.g., President)"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className="glass-input"
          required
        />
        <button type="submit" className="glass-button">
          {editing ? 'Update' : 'Add'}
        </button>
      </form>
      <ul className="space-y-2">
        {designations.map(d => (
          <li key={d.value} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
            <span className="font-medium">{d.label}</span>
            <span className="text-sm text-gray-500">({d.value})</span>
            <div>
              <button onClick={() => startEdit(d)} className="text-blue-600 dark:text-blue-400 mr-2">Edit</button>
              <button onClick={() => handleDelete(d.value)} className="text-red-600 dark:text-red-400">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDesignationManager;