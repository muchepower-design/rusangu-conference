import React, { useState, useEffect } from 'react';
import api from '../api/client';
import DelegateApproval from '../components/delegates/DelegateApproval';
import BadgeGenerator from '../components/delegates/BadgeGenerator';
import AttendanceManager from '../components/delegates/AttendanceManager';
import MealManager from '../components/delegates/MealManager';
import Skeleton from '../components/common/Skeleton';

const DelegatesPage = () => {
  const [delegates, setDelegates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approval');

  const fetchDelegates = async () => {
    try {
      //const res = await api.get('/users/', { params: { guest_type: 'delegate' } });
      const res = await api.get('/users/');
      setDelegates(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDelegates();
  }, []);

  const tabs = [
    { id: 'approval', label: 'Approve Delegates' },
    { id: 'badges', label: 'Generate Badges' },
    { id: 'attendance', label: 'Attendance' },
    { id: 'meals', label: 'Meals' },
  ];

  if (loading) {
    return (
      <div>
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <div className="glass p-2 rounded-xl mb-6 flex flex-wrap gap-2">
          {[1,2,3,4].map(i => <Skeleton.Text key={i} width="w-24" height="h-10" />)}
        </div>
        <Skeleton.Form fields={4} />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">Delegates Management</h1>
      <div className="glass p-2 rounded-xl mb-6 flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 rounded-lg transition ${
              activeTab === tab.id
                ? 'bg-sda-blue text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {activeTab === 'approval' && <DelegateApproval delegates={delegates} onUpdate={fetchDelegates} />}
        {activeTab === 'badges' && <BadgeGenerator delegates={delegates} onUpdate={fetchDelegates} />}
        {activeTab === 'attendance' && <AttendanceManager delegates={delegates} onUpdate={fetchDelegates} />}
        {activeTab === 'meals' && <MealManager delegates={delegates} onUpdate={fetchDelegates} />}
      </div>
    </div>
  );
};

export default DelegatesPage;