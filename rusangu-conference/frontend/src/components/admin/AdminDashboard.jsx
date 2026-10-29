import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading statistics...</div>;
  if (!stats) return <div>No stats available.</div>;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Users</h3>
          <p className="text-2xl font-bold">{stats.total_users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Reports</h3>
          <p className="text-2xl font-bold">{stats.total_reports}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Districts</h3>
          <p className="text-2xl font-bold">{stats.total_districts}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 text-sm">Total Officials</h3>
          <p className="text-2xl font-bold">{stats.total_officials}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-2">Reports by Status</h3>
        <ul>
          {Object.entries(stats.reports_by_status || {}).map(([status, count]) => (
            <li key={status} className="flex justify-between border-b py-1">
              <span className="capitalize">{status}</span>
              <span>{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;