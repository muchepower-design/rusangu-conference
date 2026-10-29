import React from 'react';
import { Link } from 'react-router-dom';

const PresidentDuties = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="glass-card border-t-4 border-sda-blue">
        <div className="text-4xl mb-2">📊</div>
        <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">Admin Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Full admin panel</p>
        <Link to="/admin/stats" className="glass-button mt-4 inline-block">Go to Admin</Link>
      </div>
      <div className="glass-card border-t-4 border-sda-gold">
        <div className="text-4xl mb-2">👥</div>
        <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">User Management</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage users and permissions</p>
        <Link to="/admin/users" className="glass-button mt-4 inline-block">Go to Users</Link>
      </div>
      <div className="glass-card border-t-4 border-sda-blue-light">
        <div className="text-4xl mb-2">👔</div>
        <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">Official Management</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Assign designations to officials</p>
        <Link to="/officials" className="glass-button mt-4 inline-block">Go to Officials</Link>
      </div>
    </div>
  );
};

export default PresidentDuties;