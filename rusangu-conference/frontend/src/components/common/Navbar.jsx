import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useModules } from '../../hooks/useModules';
import { useTheme } from '../../contexts/ThemeContext';
import { useSidebar } from '../../contexts/SidebarContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { hasModule } = useModules();
  const { darkMode, toggleDarkMode } = useTheme();
  const { isOpen, toggle } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={`glass sticky top-0 z-40 border-b ${darkMode ? 'border-gray-700' : 'border-white/30'}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {/* Hamburger button (visible only when logged in) */}
          {user && (
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-white/20 transition"
              aria-label="Toggle sidebar"
            >
              <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          )}

          {!user && (
            <>
          <Link to="/" className="text-2xl font-bold text-sda-blue dark:text-sda-blue-light">
            Rusangu Conference
          </Link>
          </>
          )}
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {!user && (
            <>
              <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-sda-blue dark:hover:text-sda-blue-light text-sm md:text-base">Home</Link>
              <Link to="/events" className="text-gray-700 dark:text-gray-300 hover:text-sda-blue dark:hover:text-sda-blue-light text-sm md:text-base">Events</Link>
              <Link to="/about" className="text-gray-700 dark:text-gray-300 hover:text-sda-blue dark:hover:text-sda-blue-light text-sm md:text-base">About</Link>
              <Link to="/contact" className="text-gray-700 dark:text-gray-300 hover:text-sda-blue dark:hover:text-sda-blue-light text-sm md:text-base">Contact</Link>
            </>
          )}

          {user && (
            <>
              <span className="hidden md:inline text-sm text-gray-600 dark:text-gray-400">
                {user.first_name}
              </span>
              <button onClick={handleLogout} className="glass-button-danger text-sm">Logout</button>
            </>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full glass hover:scale-105 transition"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {!user && (
            <>
              <Link to="/login" className="glass-button text-sm">Login</Link>
              <Link to="/register" className="glass-button-gold text-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;