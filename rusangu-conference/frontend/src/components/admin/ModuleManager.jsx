import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import LoadingSpinner from '../common/LoadingSpinner';

const ModuleManager = () => {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchModules = async () => {
    try {
      const res = await api.get('modules/');
      setModules(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const createModule = async () => {
    if (!newModule.trim()) return;
    await api.post('/modules', { name: newModule });
    setNewModule('');
    fetchModules();
  };

  const deleteModule = async (id) => {
    if (window.confirm('Delete this module?')) {
      await api.delete(`/modules/${id}`);
      fetchModules();
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Manage Modules</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          placeholder="New module name"
          className="glass-input flex-1"
        />
        <button onClick={createModule} className="glass-button">Add Module</button>
      </div>
      <div className="glass-card p-4">
        <ul className="space-y-2">
          {modules.map(m => (
            <li key={m.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
              <span className="font-medium">{m.name}</span>
              <button onClick={() => deleteModule(m.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleManager;