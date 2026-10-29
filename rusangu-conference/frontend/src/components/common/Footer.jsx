import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';

const Footer = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  // If user is logged in, don't show footer
  if (user) return null;

  return (
    <footer className={`mt-12 py-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} glass`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-sda-blue dark:text-sda-blue-light">Rusangu Conference</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Seventh-day Adventist Church<br />
              Southern Zambia Union Conference<br />
              SID Division
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><Link to="/" className="text-sm text-gray-600 dark:text-gray-400 hover:text-sda-blue dark:hover:text-sda-blue-light">Home</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-sda-blue dark:hover:text-sda-blue-light">About</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-sda-blue dark:hover:text-sda-blue-light">Contact</Link></li>
              <li><Link to="/events" className="text-sm text-gray-600 dark:text-gray-400 hover:text-sda-blue dark:hover:text-sda-blue-light">Events</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Powered by <br />
              <a href="https://www.kanchtech.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sda-blue dark:text-sda-blue-light hover:underline">
                Kanchy Innovative Technologies
              </a>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              &copy; {currentYear} Rusangu Conference. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;