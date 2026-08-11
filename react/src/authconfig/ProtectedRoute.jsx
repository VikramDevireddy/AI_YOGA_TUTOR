import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import SecuredNavigation from '../navigation/securedNavigation/SecuredNavigation';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { token, loading } = useAuth();

  // Still initializing from localStorage — show nothing
  if (loading) return null;

  // Not authenticated — redirect to login
  if (!token) return <Navigate to="/login" replace />;

  return (
    <div>
      <SecuredNavigation />
      <Outlet />
    </div>
  );
}

export default ProtectedRoute;