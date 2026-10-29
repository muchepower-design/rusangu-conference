import React, { useState } from 'react';

const MeetingForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [agenda, setAgenda] = useState('');
  const [date_time, setDateTime] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, agenda, date_time, location });
    setTitle('');
    setAgenda('');
    setDateTime('');
    setLocation('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Schedule Meeting</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Agenda</label>
        <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} className="w-full border rounded px-3 py-2" rows="3" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Date & Time</label>
        <input type="datetime-local" value={date_time} onChange={(e) => setDateTime(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Location</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Schedule</button>
    </form>
  );
};

export default MeetingForm;