import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import LoadingSpinner from '../common/LoadingSpinner';

const DepartmentManager = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/modules/departments');
      setDepartments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const createDept = async () => {
    if (!newDept.trim()) return;
    await api.post('/modules/departments', { name: newDept });
    setNewDept('');
    fetchDepartments();
  };

  const deleteDept = async (id) => {
    if (window.confirm('Delete this department?')) {
      await api.delete(`/modules/departments/${id}`);
      fetchDepartments();
    }
  };

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Manage Departments</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="New department name"
          className="glass-input flex-1"
        />
        <button onClick={createDept} className="glass-button">Add Department</button>
      </div>
      <div className="glass-card p-4">
        <ul className="space-y-2">
          {departments.map(d => (
            <li key={d.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
              <span className="font-medium">{d.name}</span>
              <button onClick={() => deleteDept(d.id)} className="text-red-600 dark:text-red-400 hover:text-red-800">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DepartmentManager;