import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useModules } from '../../hooks/useModules';
import Skeleton from './Skeleton';

const ProtectedRoute = ({ children, requiredModule, allowedDesignations = [] }) => {
  const { user, loading } = useAuth();
  const { hasModule } = useModules();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Skeleton.Text width="w-64" height="h-8" />
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;

  // If no requiredModule and no allowedDesignations, allow access (just authenticated)
  if (!requiredModule && allowedDesignations.length === 0) {
    return children;
  }
  
  // Check if user has the required module OR has a designation in allowedDesignations
  const hasAccess = 
    (requiredModule && hasModule(requiredModule)) || 
    (allowedDesignations.length > 0 && user.designation && allowedDesignations.includes(user.designation));

  if (!hasAccess) {
    return (
      <div className="text-center p-12 glass-card max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          You do not have permission to access this page.
          {requiredModule && <span> Required module: <strong>{requiredModule}</strong></span>}
          {allowedDesignations.length > 0 && <span> Allowed designations: <strong>{allowedDesignations.join(', ')}</strong></span>}
        </p>
      </div>
    );
  }
  return children;
};

export default ProtectedRoute;