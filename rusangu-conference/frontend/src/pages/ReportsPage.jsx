import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../api/client';
import ReportForm from '../components/reports/ReportForm';
import ReportList from '../components/reports/ReportList';
import ReportReview from '../components/reports/ReportReview';
import Skeleton from '../components/common/Skeleton';

const reportTypes = [
  { value: 'stewardship', label: 'Stewardship' },
  { value: 'personal_ministries', label: 'Personal Ministries' },
  { value: 'sabbath_school', label: 'Sabbath School' },
  { value: 'family_life', label: 'Family Life' },
  { value: 'apm', label: 'APM (Adventist Possibility Ministry)' },
  { value: 'ministerial', label: 'Ministerial' },
  { value: 'youth', label: 'Youth' },
  { value: 'music', label: 'Music' },
  { value: 'chaplaincy', label: 'Chaplaincy' },
];

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState('stewardship');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get('/reports/list');
      setReports(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSubmit = async (data) => {
    const payload = {
      district_id: data.district || user.district_id || 1,
      quarter: 1,
      year: new Date().getFullYear(),
      report_type: selectedType,
      data: data
    };
    await api.post('/reports/', payload);
    fetchReports();
    setEditing(false);
  };

  const handleReview = async (reportId, action) => {
    await api.post(`/reports/${reportId}/review`, { action });
    fetchReports();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <Skeleton.Form fields={4} />
        <Skeleton.Table rows={3} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-sda-blue dark:text-sda-blue-light">Reports</h1>

      <div className="glass-card">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Report Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="glass-input w-full md:w-64"
        >
          {reportTypes.map(rt => (
            <option key={rt.value} value={rt.value}>{rt.label}</option>
          ))}
        </select>
      </div>

      {user?.designation && ['district_pastor','director','cfo','executive_secretary','president'].includes(user.designation) && (
        <div className="glass-card">
          <h2 className="text-xl font-semibold mb-2">Review Reports</h2>
          <ReportReview reports={reports} onReview={handleReview} />
        </div>
      )}

      <div>
        <button onClick={() => setEditing(!editing)} className="glass-button">
          {editing ? 'Cancel' : 'New Report'}
        </button>
        {editing && (
          <div className="mt-4 glass-card">
            <ReportForm
              reportType={selectedType}
              onSubmit={handleSubmit}
              initialData={{ district: user.district_id || '' }}
            />
          </div>
        )}
      </div>

      <div className="glass-card">
        <h2 className="text-xl font-semibold mb-2">Your Submitted Reports</h2>
        <ReportList reports={reports} />
      </div>
    </div>
  );
};

export default ReportsPage;