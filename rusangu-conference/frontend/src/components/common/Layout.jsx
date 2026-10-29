import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../hooks/useAuth';
import { useSidebar } from '../../contexts/SidebarContext';

const Layout = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const { isOpen } = useSidebar();

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      {user && <Sidebar />}

      {/* Main content column */}
      <div className={`flex-1 flex flex-col overflow-y-auto transition-all duration-300 ${user && isOpen ? 'md:ml-72' : 'ml-0'}`}>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <Footer />
      </div>

      {/* Right sidebar with SDA logo */}
      <div className={`
        hidden md:flex w-16 lg:w-20 
        sticky top-0 h-screen 
        ${darkMode ? 'bg-sda-blue/90' : 'bg-sda-blue-dark'}
        flex-col items-center justify-start pt-6
        border-l border-white/10
      `}>
        <div className="flex flex-col items-center space-y-2">
          <img 
            src="/sda1.jpg" 
            alt="Seventh-day Adventist Church Logo"
            className="w-14 h-14 lg:w-20 lg:h-20 object-contain"
          />
          <span className="text-white/80 text-[10px] lg:text-sm font-semibold text-center leading-tight mt-1">
            Rusangu Conference
          </span>
        </div>
        <div className="w-8 h-px bg-white/20 mt-4"></div>
        <div className="mt-auto mb-6 text-white/20 text-xs">✝</div>
      </div>
    </div>
  );
};

export default Layout;