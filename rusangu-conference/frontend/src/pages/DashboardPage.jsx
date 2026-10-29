import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useModules } from '../hooks/useModules';
import Skeleton from '../components/common/Skeleton';

const DashboardPage = () => {
  const { user, loading } = useAuth();
  const { modules } = useModules();

  const designations = user?.designation || [];
  const isAdmin = modules.includes('admin');
  const isPresident = designations.includes('president');
  const isExecSecretary = designations.includes('executive_secretary');
  const canManageOfficials = isAdmin || isPresident || isExecSecretary;

  const moduleConfig = {
    reports: { label: 'Reports', path: '/reports' },
    officials: { label: 'Officials', path: '/officials' }, // always "Officials"
    camps: { label: 'Camps', path: '/camps' },
    meetings: { label: 'Meetings', path: '/meetings' },
  };

  if (canManageOfficials) {
    moduleConfig.admin = { label: 'Admin Dashboard', path: '/admin' };
  }

  if (modules.includes('session_meetings_delegate')) {
    if (canManageOfficials) {
      moduleConfig.session_meetings_delegate = { label: 'Delegates Management', path: '/session_meetings_delegate' };
    } else {
      moduleConfig.session_meetings_delegate = { label: 'My Delegate Info', path: '/my-delegate' };
    }
  }

  const availableModules = modules.filter(mod => moduleConfig[mod]);

  if (loading) {
    return (
      <div>
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <Skeleton.Grid columns={3} count={6} />
      </div>
    );
  }

  if (availableModules.length === 0) {
    return (
      <div className="text-center p-12 glass-card max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">No Modules Assigned</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Please contact your administrator to assign modules.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Welcome, {user?.first_name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableModules.map((mod) => {
          const config = moduleConfig[mod];
          return (
            <Link key={mod} to={config.path} className="glass-card hover:scale-105 transition border-t-4 border-sda-blue">
              <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light capitalize">{config.label}</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Access {config.label} module</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;