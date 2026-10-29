import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminOfficerManager = () => {
  const [officers, setOfficers] = useState([]);
  const [formData, setFormData] = useState({ name: '', label: '' });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOfficers = async () => {
    try {
      const res = await api.get('/officials/officers');
      setOfficers(res.data);
    } catch (error) {
      console.error('Error fetching officers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/officials/officers/${editing}`, formData);
      } else {
        await api.post('/officials/officers', formData);
      }
      setFormData({ name: '', label: '' });
      setEditing(null);
      fetchOfficers();
    } catch (error) {
      console.error('Error saving officer:', error);
      alert(error.response?.data?.error || 'Failed to save');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this officer?')) return;
    try {
      await api.delete(`/officials/officers/${id}`);
      fetchOfficers();
    } catch (error) {
      alert(error.response?.data?.error || 'Cannot delete officer in use');
    }
  };

  const startEdit = (officer) => {
    setEditing(officer.id);
    setFormData({ name: officer.name, label: officer.label });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Manage Officers</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          type="text"
          placeholder="Name (e.g., secretary)"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="glass-input"
          required
        />
        <input
          type="text"
          placeholder="Label (e.g., Secretary)"
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
        {officers.map(o => (
          <li key={o.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
            <span className="font-medium">{o.label}</span>
            <span className="text-sm text-gray-500">({o.name})</span>
            <div>
              <button onClick={() => startEdit(o)} className="text-blue-600 dark:text-blue-400 mr-2">Edit</button>
              <button onClick={() => handleDelete(o.id)} className="text-red-600 dark:text-red-400">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminOfficerManager;