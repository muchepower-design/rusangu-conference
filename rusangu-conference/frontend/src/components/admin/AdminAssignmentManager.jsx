import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminAssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/officials/officer-assignments');
      setAssignments(res.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this assignment?')) return;
    try {
      await api.delete(`/officials/officer-assignments/${id}`);
      fetchAssignments();
    } catch (error) {
      alert('Failed to remove assignment');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="glass-card">
      <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">Officer Assignments</h2>
      {assignments.length === 0 ? (
        <p className="text-gray-500">No assignments found.</p>
      ) : (
        <ul className="space-y-2">
          {assignments.map(a => (
            <li key={a.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 py-2">
              <div>
                <span className="font-medium">{a.officer_name}</span>
                <span className="text-sm text-gray-500 ml-2">
                  → {a.assigned_to_type === 'official' ? 'Official' : 'Department'}: {a.target_name}
                </span>
              </div>
              <button onClick={() => handleDelete(a.id)} className="text-red-600 dark:text-red-400">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminAssignmentManager;