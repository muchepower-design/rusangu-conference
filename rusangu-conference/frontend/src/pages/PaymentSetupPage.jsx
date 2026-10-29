import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../hooks/useAuth';
import Skeleton from '../components/common/Skeleton';

const PaymentSetupPage = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user?.designation !== 'executive_secretary' && !user?.modules.includes('admin')) {
      return;
    }
    fetchCategories();
  }, [user]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/payments/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editingId) {
        await api.put(`/payments/categories/${editingId}`, formData);
        setSuccess('Category updated');
      } else {
        await api.post('/payments/categories', formData);
        setSuccess('Category created');
      }
      setFormData({ name: '', description: '' });
      setEditingId(null);
      fetchCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setFormData({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/payments/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.error || 'Cannot delete category in use');
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    await api.put(`/payments/categories/${id}`, { is_active: !currentStatus });
    fetchCategories();
  };

  if (user?.designation !== 'executive_secretary' && !user?.modules.includes('admin')) {
    return <div className="glass-card text-center p-8">You are not authorized to manage payment categories.</div>;
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <Skeleton.Form fields={2} />
        <Skeleton.Table rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Payment Setup</h1>

      <div className="glass-card mb-6">
        <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit Category' : 'Create New Category'}</h2>
        {success && <div className="bg-green-500/20 text-green-700 dark:text-green-300 p-2 rounded mb-4">{success}</div>}
        {error && <div className="bg-red-500/20 text-red-700 dark:text-red-300 p-2 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Category Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="glass-input w-full"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="glass-input w-full"
              rows="2"
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="glass-button">{editingId ? 'Update' : 'Create'}</button>
            {editingId && (
              <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', description: '' }); }} className="glass-button bg-gray-500/80 hover:bg-gray-600/80">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="glass-card">
        <h2 className="text-xl font-semibold mb-4">Payment Categories</h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No categories set up yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/20 dark:bg-gray-800/20">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id} className="border-t border-gray-200/50 dark:border-gray-700/50">
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.description || '—'}</td>
                    <td className="p-2">
                      <button
                        onClick={() => handleToggleActive(c.id, c.is_active)}
                        className={`px-2 py-1 rounded text-xs ${c.is_active ? 'bg-green-500/70 text-white' : 'bg-gray-400/70 text-white'}`}
                      >
                        {c.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-2 space-x-2">
                      <button onClick={() => handleEdit(c)} className="text-blue-600 dark:text-blue-400">Edit</button>
                      <button onClick={() => handleDelete(c.id)} className="text-red-600 dark:text-red-400">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSetupPage;