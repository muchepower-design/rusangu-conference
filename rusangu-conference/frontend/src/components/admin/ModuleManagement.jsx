import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const ModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState('');

  const fetchModules = async () => {
    const res = await api.get('/modules');
    setModules(res.data);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const addModule = async () => {
    if (!newModule.trim()) return;
    await api.post('/modules', { name: newModule });
    setNewModule('');
    fetchModules();
  };

  const deleteModule = async (id) => {
    if (!window.confirm('Delete this module?')) return;
    await api.delete(`/modules/${id}`);
    fetchModules();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Module Management</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newModule}
          onChange={(e) => setNewModule(e.target.value)}
          placeholder="New module name"
          className="border p-2 rounded-l flex-1"
        />
        <button onClick={addModule} className="bg-blue-600 text-white px-4 py-2 rounded-r">Add Module</button>
      </div>
      <ul className="bg-white rounded shadow">
        {modules.map(m => (
          <li key={m.id} className="flex justify-between items-center border-b p-3">
            <span>{m.name}</span>
            <button onClick={() => deleteModule(m.id)} className="text-red-600">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModuleManagement;