import React, { useState } from 'react';

const CampForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [start_date, setStartDate] = useState('');
  const [end_date, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, start_date, end_date, description });
    setName('');
    setStartDate('');
    setEndDate('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">Create Camp</h2>
      <div className="mb-2">
        <label className="block text-sm font-medium">Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Start Date</label>
        <input type="date" value={start_date} onChange={(e) => setStartDate(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">End Date</label>
        <input type="date" value={end_date} onChange={(e) => setEndDate(e.target.value)} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-medium">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded px-3 py-2" rows="3" />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
    </form>
  );
};

export default CampForm;