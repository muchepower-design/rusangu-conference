import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import DirectorDuties from '../components/officials/duties/DirectorDuties';
import DistrictPastorDuties from '../components/officials/duties/DistrictPastorDuties';
import PastorDuties from '../components/officials/duties/PastorDuties';
import ConferenceOfficialDuties from '../components/officials/duties/ConferenceOfficialDuties';
import CFODuties from '../components/officials/duties/CFODuties';
import PresidentDuties from '../components/officials/duties/PresidentDuties';
import ExecutiveSecretaryDuties from '../components/officials/duties/ExecutiveSecretaryDuties';
import AdminDuties from '../components/officials/duties/AdminDuties';
import Skeleton from '../components/common/Skeleton';

const OfficialDutiesPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <Skeleton.Text width="w-64" height="h-8" className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton.Card />
          <Skeleton.Card />
          <Skeleton.Card />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const designations = user.designation || [];
  const isAdmin = user.modules?.includes('admin');

  // Determine which component to render based on designation
  let DutyComponent = null;
  let roleName = '';

  // Check for specific designations first
  if (designations.includes('president')) {
    DutyComponent = PresidentDuties;
    roleName = 'President';
  } else if (designations.includes('executive_secretary')) {
    DutyComponent = ExecutiveSecretaryDuties;
    roleName = 'Executive Secretary';
  } else if (designations.includes('director')) {
    DutyComponent = DirectorDuties;
    roleName = 'Director';
  } else if (designations.includes('district_pastor')) {
    DutyComponent = DistrictPastorDuties;
    roleName = 'District Pastor';
  } else if (designations.includes('pastor')) {
    DutyComponent = PastorDuties;
    roleName = 'Pastor';
  } else if (designations.includes('conference_official')) {
    DutyComponent = ConferenceOfficialDuties;
    roleName = 'Conference Official';
  } else if (designations.includes('cfo')) {
    DutyComponent = CFODuties;
    roleName = 'CFO';
  } else if (isAdmin) {
    // If user has admin module but no specific designation, show AdminDuties
    DutyComponent = AdminDuties;
    roleName = 'Administrator';
  } else {
    // Fallback
    return (
      <div className="glass-card text-center p-8">
        <p className="text-gray-600 dark:text-gray-400">
          You are an official but do not have a specific role assigned. Please contact your administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-sda-blue dark:text-sda-blue-light">
        My Official Duties: {roleName}
      </h2>
      <DutyComponent user={user} />
    </div>
  );
};

export default OfficialDutiesPage;