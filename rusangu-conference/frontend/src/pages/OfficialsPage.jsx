import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import DesignationManager from '../components/officials/DesignationManager';
import OfficialDutiesPage from './OfficialDutiesPage';
import Skeleton from '../components/common/Skeleton';

const OfficialsPage = () => {
  const { user } = useAuth();
  const [officials, setOfficials] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('duties');

  // Fix: use user.designation (singular), fallback to empty array
  const designations = user?.designation || [];
  const isAdmin = user?.modules?.includes('admin');
  const isPresident = designations.includes('president');
  const isExecSecretary = designations.includes('executive_secretary');
  const canManageOfficials = isAdmin || isPresident || isExecSecretary;

  const fetchData = async () => {
    try {
      const [offRes, usersRes, deptRes, distRes] = await Promise.all([
        api.get('/officials/list'),
        api.get('/users/'),
        api.get('/modules/departments'),
        api.get('/users/districts')
      ]);
      setOfficials(offRes.data);
      setUsers(usersRes.data);
      setDepartments(deptRes.data);
      setDistricts(distRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManageOfficials) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // If user doesn't have the officials module, don't show this page (though the route already protects)
  // If not allowed to manage, show only duties
  if (!canManageOfficials) {
    return <OfficialDutiesPage />;
  }

  // Show skeleton while loading data for the management tab
  if (loading) {
    return (
      <div>
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <div className="glass p-2 rounded-xl mb-6 flex flex-wrap gap-2">
          <Skeleton.Text width="w-32" height="h-10" className="rounded-lg" />
          <Skeleton.Text width="w-32" height="h-10" className="rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton.Form fields={4} />
          <Skeleton.Table rows={3} cols={4} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Officials</h1>

      {/* Tab bar */}
      <div className="glass p-2 rounded-xl mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('duties')}
          className={`py-2 px-4 rounded-lg transition ${
            activeTab === 'duties'
              ? 'bg-sda-blue text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
          }`}
        >
          My Official Duties
        </button>
        <button
          onClick={() => setActiveTab('manage')}
          className={`py-2 px-4 rounded-lg transition ${
            activeTab === 'manage'
              ? 'bg-sda-blue text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
          }`}
        >
          Manage Officials
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'duties' && <OfficialDutiesPage />}
      {activeTab === 'manage' && (
        <DesignationManager
          officials={officials}
          users={users}
          departments={departments}
          districts={districts}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
};

export default OfficialsPage;