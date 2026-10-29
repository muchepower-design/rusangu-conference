import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UserManager from '../components/admin/UserManager';
import ModuleManager from '../components/admin/ModuleManager';
import DistrictManager from '../components/admin/DistrictManager';
import DepartmentManager from '../components/admin/DepartmentManager';
import Statistics from '../components/admin/Statistics';
import AdminDesignationManager from '../components/admin/AdminDesignationManager';
import AdminOfficerManager from '../components/admin/AdminOfficerManager';
import AdminAssignmentManager from '../components/admin/AdminAssignmentManager';
import AdminContentManager from '../components/admin/AdminContentManager';

const AdminPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const path = location.pathname;

  if (!user?.modules.includes('admin') && !['president', 'executive_secretary'].includes(user?.designation)) {
    return <div className="p-8 text-center text-red-600">You do not have admin access.</div>;
  }

  const renderContent = () => {
    if (path.includes('/stats')) return <Statistics />;
    if (path.includes('/users')) return <UserManager />;
    if (path.includes('/modules')) return <ModuleManager />;
    if (path.includes('/districts')) return <DistrictManager />;
    if (path.includes('/departments')) return <DepartmentManager />;
    if (path.includes('/designations')) return <AdminDesignationManager />;
    if (path.includes('/officers')) return <AdminOfficerManager />;
    if (path.includes('/assignments')) return <AdminAssignmentManager />;
    if (path.includes('/content')) return <AdminContentManager />;
    // default
    return <Statistics />;
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Admin Dashboard</h1>
      {renderContent()}
    </div>
  );
};

export default AdminPage;