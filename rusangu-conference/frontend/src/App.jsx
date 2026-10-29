import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ReportsPage from './pages/ReportsPage';
import OfficialsPage from './pages/OfficialsPage';
import DelegatesPage from './pages/DelegatesPage';
import MyDelegatePage from './pages/MyDelegatePage';
import CampsPage from './pages/CampsPage';
import MeetingsPage from './pages/MeetingsPage';
import AdminPage from './pages/AdminPage';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import EventsPage from './pages/EventsPage';
import Layout from './components/common/Layout';

import ProfilePage from './pages/ProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentSetupPage from './pages/PaymentSetupPage';

import OfficialDashboard from './pages/OfficialDashboard';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="/events" element={<EventsPage />} />


<Route path="official-dashboard" element={
  <ProtectedRoute>
    <OfficialDashboard />
  </ProtectedRoute>
} />

        <Route path="profile" element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
<Route path="change-password" element={
  <ProtectedRoute>
    <ChangePasswordPage />
  </ProtectedRoute>
} />
<Route path="payments" element={
  <ProtectedRoute>
    <PaymentsPage />
  </ProtectedRoute>
} />
<Route path="admin/payment-setup" element={
  <ProtectedRoute 
    allowedDesignations={['executive_secretary', 'president']}
  >
    <PaymentSetupPage />
  </ProtectedRoute>
} />

        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="reports" element={
          <ProtectedRoute requiredModule="reports">
            <ReportsPage />
          </ProtectedRoute>
        } />
        <Route path="officials" element={
          <ProtectedRoute requiredModule="officials">
            <OfficialsPage />
          </ProtectedRoute>
        } />
        <Route path="session_meetings_delegate" element={
          <ProtectedRoute requiredModule="session_meetings_delegate">
            <DelegatesPage />
          </ProtectedRoute>
        } />
        <Route path="my-delegate" element={
          <ProtectedRoute requiredModule="session_meetings_delegate">
            <MyDelegatePage />
          </ProtectedRoute>
        } />
        <Route path="camps" element={
          <ProtectedRoute requiredModule="camps">
            <CampsPage />
          </ProtectedRoute>
        } />
        <Route path="meetings" element={
          <ProtectedRoute requiredModule="meetings">
            <MeetingsPage />
          </ProtectedRoute>
        } />
        <Route path="admin/*" element={
          <ProtectedRoute 
            requiredModule="admin"
            allowedDesignations={['president', 'executive_secretary']}
          >
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;