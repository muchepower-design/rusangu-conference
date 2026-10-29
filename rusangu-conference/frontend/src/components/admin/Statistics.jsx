import React, { useState, useEffect } from 'react';
import api from '../../api/client';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="glass-card p-8 text-center">Loading stats...</div>;
  if (!stats) return <div className="glass-card p-8 text-center text-red-600">Error loading stats.</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="glass-card text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Users</h3>
        <p className="text-3xl font-bold text-blue-600">{stats.users}</p>
      </div>
      <div className="glass-card text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Reports</h3>
        <p className="text-3xl font-bold text-green-600">{stats.reports}</p>
      </div>
      <div className="glass-card text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Districts</h3>
        <p className="text-3xl font-bold text-purple-600">{stats.districts}</p>
      </div>
      <div className="glass-card text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Departments</h3>
        <p className="text-3xl font-bold text-yellow-600">{stats.departments}</p>
      </div>
      <div className="glass-card text-center">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Officials</h3>
        <p className="text-3xl font-bold text-red-600">{stats.officials}</p>
      </div>
    </div>
  );
};

export default Statistics;