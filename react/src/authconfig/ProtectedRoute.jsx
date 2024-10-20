import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import MainNavigationBar from '../navigation/MainNavigationBar';
import SecuredNavigation from '../navigation/securedNavigation/SecuredNavigation';

const ProtectedRoute = () => {
  const isAuthenticated = true;
  return isAuthenticated ? (
    <div>
      <SecuredNavigation />
      <Outlet />
    </div>
  ) : (
    <Navigate to="/" />
  );

}

export default ProtectedRoute