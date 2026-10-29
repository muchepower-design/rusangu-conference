import React from 'react';
import { Link } from 'react-router-dom';

const CFODuties = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="glass-card border-t-4 border-sda-blue">
        <div className="text-4xl mb-2">📊</div>
        <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">Financial Reports</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Review financial reports</p>
        <Link to="/reports" className="glass-button mt-4 inline-block">Go to Reports</Link>
      </div>
      <div className="glass-card border-t-4 border-sda-gold">
        <div className="text-4xl mb-2">💳</div>
        <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">Payment Setup</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Manage payment categories</p>
        <Link to="/admin/payment-setup" className="glass-button mt-4 inline-block">Go to Payment Setup</Link>
      </div>
    </div>
  );
};

export default CFODuties;