import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../contexts/SidebarContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useModules } from '../../hooks/useModules';

// Define navigation items based on role/modules
const getNavItems = (user, modules) => {
  const isAdmin = modules.includes('admin');
  const designation = user?.designation;

  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  ];

  // After baseItems, before profileItems:
if (user?.designation && user.designation.length > 0) {
  baseItems.push({ id: 'official-dashboard', label: 'Official Dashboard', icon: '📊', path: '/official-dashboard' });
}

  const profileItems = [
    { id: 'profile', label: 'My Profile', icon: '👤', path: '/profile' },
    { id: 'change-password', label: 'Change Password', icon: '🔑', path: '/change-password' },
    { id: 'payments', label: 'Payments', icon: '💰', path: '/payments' },
  ];

  const adminItems = [
    { id: 'stats', label: 'Statistics', icon: '📈', path: '/admin/stats' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'modules', label: 'Modules', icon: '🧩', path: '/admin/modules' },
    { id: 'districts', label: 'Districts', icon: '📍', path: '/admin/districts' },
    { id: 'departments', label: 'Departments', icon: '🏢', path: '/admin/departments' },
    { id: 'designations', label: 'Designations', icon: '🏷️', path: '/admin/designations' },
    { id: 'officers', label: 'Officers', icon: '👤', path: '/admin/officers' },
    { id: 'assignments', label: 'Assignments', icon: '📋', path: '/admin/assignments' },
    { id: 'content', label: 'Content', icon: '📝', path: '/admin/content' },
    { id: 'payment-setup', label: 'Payment Setup', icon: '💳', path: '/admin/payment-setup' },
  ];

  const executiveItems = [
    { id: 'stats', label: 'Statistics', icon: '📈', path: '/admin/stats' },
    { id: 'users', label: 'Users', icon: '👥', path: '/admin/users' },
    { id: 'districts', label: 'Districts', icon: '📍', path: '/admin/districts' },
    { id: 'officers', label: 'Officers', icon: '👤', path: '/admin/officers' },
    { id: 'assignments', label: 'Assignments', icon: '📋', path: '/admin/assignments' },
    { id: 'content', label: 'Content', icon: '📝', path: '/admin/content' },
    { id: 'payment-setup', label: 'Payment Setup', icon: '💳', path: '/admin/payment-setup' },
  ];

const moduleItems = [];
if (modules.includes('reports')) moduleItems.push({ id: 'reports', label: 'Reports', icon: '📄', path: '/reports' });
if (modules.includes('officials')) {
  moduleItems.push({ id: 'officials', label: 'Officials', icon: '👔', path: '/officials' });
}
if (modules.includes('camps')) moduleItems.push({ id: 'camps', label: 'Camps', icon: '🏕️', path: '/camps' });
if (modules.includes('meetings')) moduleItems.push({ id: 'meetings', label: 'Meetings', icon: '📅', path: '/meetings' });
if (modules.includes('session_meetings_delegate')) {
  if (isAdmin) {
    moduleItems.push({ id: 'delegates', label: 'Delegates', icon: '🪪', path: '/session_meetings_delegate' });
  } else {
    moduleItems.push({ id: 'my_delegate', label: 'My Delegate Info', icon: '🪪', path: '/my-delegate' });
  }
}

  let items = [...baseItems, ...profileItems];
  if (isAdmin) {
    items = [...items, ...adminItems];
  } else if (designation === 'executive_secretary' || designation === 'president') {
    items = [...items, ...executiveItems];
  }
  items = [...items, ...moduleItems];

  const seen = new Set();
  items = items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return items;
};

const Sidebar = () => {
  const { user } = useAuth();
  const { modules } = useModules();
  const { isOpen, close } = useSidebar();
  const { darkMode } = useTheme();
  const location = useLocation();
  const [showImageModal, setShowImageModal] = useState(false);

  const navItems = getNavItems(user, modules);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const profileImageUrl = user?.profile_picture
    ? `${baseUrl}/users/${user.profile_picture}`
    : null;

  const handleImageClick = () => {
    if (profileImageUrl) {
      setShowImageModal(true);
    }
  };

  return (
    <>
      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 cursor-pointer"
          onClick={() => setShowImageModal(false)}
        >
          <div className="max-w-2xl max-h-screen p-4">
            <img
              src={profileImageUrl}
              alt="Profile"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={close} />
      )}

      <div className={`
        fixed top-0 left-0 h-full z-50 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-64 md:w-72
        ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'}
        backdrop-blur-xl border-r border-white/20 dark:border-gray-700/30
        shadow-2xl
        flex flex-col
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center space-x-2">
            {profileImageUrl ? (
              <button
                onClick={handleImageClick}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-sda-blue hover:opacity-80 transition focus:outline-none flex-shrink-0"
              >
                <img
                  src={profileImageUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
            ) : (
              <img src="/sda1.jpg" alt="SDA Logo" className="w-8 h-8 object-contain" />
            )}
            <span className="font-bold text-sda-blue dark:text-sda-blue-light truncate max-w-[120px]">
              {user?.first_name ? `${user.first_name} ${user.last_name?.[0] || ''}` : 'Rusangu Conference'}
            </span>
          </div>
          <button
            onClick={close}
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
                             (item.path.startsWith('/admin') && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => { if (window.innerWidth < 768) close(); }}
                className={`
                  flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-sda-blue text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/50'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 text-center flex-shrink-0">
          Rusangu Conference IMIS (RCIMIS v1.0)
        </div>
      </div>
    </>
  );
};

export default Sidebar;