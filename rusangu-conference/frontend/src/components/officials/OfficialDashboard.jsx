import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import Skeleton from '../components/common/Skeleton';

const OfficialDashboard = () => {
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

  const designations = user.designations || [];
  const isAdmin = user.modules?.includes('admin');
  const isPresident = designations.includes('president');
  const isExecSecretary = designations.includes('executive_secretary');
  const isCFO = designations.includes('cfo');
  const isDirector = designations.includes('director');
  const isDistrictPastor = designations.includes('district_pastor');
  const isConferenceOfficial = designations.includes('conference_official');
  const isPastor = designations.includes('pastor');

  // Build dashboard cards
  const dashboardCards = [];

  // Common cards for all officials
  dashboardCards.push(
    { id: 'profile', label: 'My Profile', icon: '👤', description: 'View and edit your profile', path: '/profile' },
    { id: 'change-password', label: 'Change Password', icon: '🔑', description: 'Update your password', path: '/change-password' },
    { id: 'payments', label: 'Payments', icon: '💰', description: 'Make and view payments', path: '/payments' }
  );

  // Admin / President / Exec Secretary
  if (isAdmin || isPresident || isExecSecretary) {
    dashboardCards.push({
      id: 'admin-stats',
      label: 'Admin Dashboard',
      icon: '📊',
      description: 'Full admin panel',
      path: '/admin/stats',
    });
  }

  // President & Exec Secretary specific
  if (isPresident || isExecSecretary) {
    dashboardCards.push(
      { id: 'users', label: 'User Management', icon: '👥', description: 'Manage users and permissions', path: '/admin/users' },
      { id: 'officials', label: 'Official Management', icon: '👔', description: 'Assign designations to officials', path: '/officials' },
      { id: 'payment-setup', label: 'Payment Setup', icon: '💳', description: 'Configure payment categories', path: '/admin/payment-setup' },
      { id: 'content', label: 'Content Management', icon: '📝', description: 'Manage website content', path: '/admin/content' }
    );
  }

  // Director
  if (isDirector) {
    dashboardCards.push({
      id: 'reports',
      label: 'Reports',
      icon: '📄',
      description: 'Submit and review reports',
      path: '/reports',
    });
  }

  // District Pastor
  if (isDistrictPastor) {
    dashboardCards.push(
      { id: 'delegates', label: 'Delegates Management', icon: '🪪', description: 'Manage delegates in your district', path: '/session_meetings_delegate' },
      { id: 'reports', label: 'Reports', icon: '📄', description: 'Submit and review reports', path: '/reports' }
    );
  }

  // Pastor
  if (isPastor) {
    dashboardCards.push({
      id: 'reports',
      label: 'Reports',
      icon: '📄',
      description: 'Submit pastoral reports',
      path: '/reports',
    });
  }

  // Conference Official
  if (isConferenceOfficial) {
    dashboardCards.push({
      id: 'reports',
      label: 'Reports',
      icon: '📄',
      description: 'Submit conference reports',
      path: '/reports',
    });
  }

  // CFO
  if (isCFO) {
    dashboardCards.push(
      { id: 'financial-reports', label: 'Financial Reports', icon: '📊', description: 'Review financial reports', path: '/reports' },
      { id: 'payment-setup', label: 'Payment Setup', icon: '💳', description: 'Manage payment categories', path: '/admin/payment-setup' }
    );
  }

  // Remove duplicates
  const seen = new Set();
  const uniqueCards = dashboardCards.filter(card => {
    if (seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-sda-blue dark:text-sda-blue-light">
        Official Dashboard
      </h1>
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          Welcome, {user.first_name} {user.last_name}
        </p>
        {designations.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Roles: {designations.join(', ')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {uniqueCards.map((card) => (
          <Link
            key={card.id}
            to={card.path}
            className="glass-card hover:scale-105 transition border-t-4 border-sda-blue"
          >
            <div className="text-4xl mb-2">{card.icon}</div>
            <h2 className="text-xl font-semibold text-sda-blue dark:text-sda-blue-light">
              {card.label}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">{card.description}</p>
          </Link>
        ))}
      </div>

      {uniqueCards.length === 0 && (
        <div className="glass-card text-center p-8">
          <p className="text-gray-600 dark:text-gray-400">
            You have no specific modules assigned. Please contact your administrator.
          </p>
        </div>
      )}
    </div>
  );
};

export default OfficialDashboard;