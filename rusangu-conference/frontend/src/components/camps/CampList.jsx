import React, { useState } from 'react';

const CampList = ({ camps, onCreate, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: '', start_date: '', end_date: '', description: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      onUpdate(editing, formData);
    } else {
      onCreate(formData);
    }
    setEditing(null);
    setFormData({ name: '', start_date: '', end_date: '', description: '' });
  };

  const startEdit = (camp) => {
    setEditing(camp.id);
    setFormData({ name: camp.name, start_date: camp.start_date, end_date: camp.end_date, description: camp.description });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="glass-input" required />
        <input type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} className="glass-input" required />
        <input type="date" value={formData.end_date} onChange={(e) => setFormData({...formData, end_date: e.target.value})} className="glass-input" required />
        <div className="flex space-x-2">
          <button type="submit" className="glass-button">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={() => { setEditing(null); setFormData({ name: '', start_date: '', end_date: '', description: '' }); }} className="glass-button bg-gray-500/80 hover:bg-gray-600/80">Cancel</button>}
        </div>
      </form>
      <ul className="space-y-2 mt-4">
        {camps.map(c => (
          <li key={c.id} className="glass-card flex flex-wrap justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{c.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.start_date} to {c.end_date}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{c.description}</p>
            </div>
            <div className="space-x-2 mt-2 sm:mt-0">
              <button onClick={() => startEdit(c)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
              <button onClick={() => onDelete(c.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampList;