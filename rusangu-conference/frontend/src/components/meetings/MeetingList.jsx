import React, { useState } from 'react';

const MeetingList = ({ meetings, onCreate, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: '', agenda: '', date_time: '', location: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      onUpdate(editing, formData);
    } else {
      onCreate(formData);
    }
    setEditing(null);
    setFormData({ title: '', agenda: '', date_time: '', location: '' });
  };

  const startEdit = (meeting) => {
    setEditing(meeting.id);
    setFormData({ title: meeting.title, agenda: meeting.agenda, date_time: meeting.date_time, location: meeting.location });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="glass-card grid grid-cols-1 sm:grid-cols-4 gap-4">
        <input type="text" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="glass-input" required />
        <input type="datetime-local" value={formData.date_time} onChange={(e) => setFormData({...formData, date_time: e.target.value})} className="glass-input" required />
        <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="glass-input" />
        <div className="flex space-x-2">
          <button type="submit" className="glass-button">{editing ? 'Update' : 'Add'}</button>
          {editing && <button onClick={() => { setEditing(null); setFormData({ title: '', agenda: '', date_time: '', location: '' }); }} className="glass-button bg-gray-500/80 hover:bg-gray-600/80">Cancel</button>}
        </div>
      </form>
      <ul className="space-y-2 mt-4">
        {meetings.map(m => (
          <li key={m.id} className="glass-card flex flex-wrap justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">{m.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(m.date_time).toLocaleString()} - {m.location}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{m.agenda}</p>
            </div>
            <div className="space-x-2 mt-2 sm:mt-0">
              <button onClick={() => startEdit(m)} className="text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
              <button onClick={() => onDelete(m.id)} className="text-red-600 dark:text-red-400 hover:underline">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeetingList;