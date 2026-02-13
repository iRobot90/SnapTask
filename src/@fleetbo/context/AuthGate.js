import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@fleetbo';

const AuthGate = () => {
  const { isLoggedIn, isLoading } = useAuth(); // eslint-disable-next-line no-unused-vars

  if (isLoading) {
    return null;
  }

  // For offline task manager, always go to tasklist
  // No login required for offline-first app
  return <Navigate to="/tasklist" replace />;
};

export default AuthGate;


