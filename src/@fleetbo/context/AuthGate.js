import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@fleetbo';

const AuthGate = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isLoggedIn) {
    // User connected -> Main page.
    return <Navigate to="/tab1" replace />;
  }

  // User not connected -> Login page.
  return <Navigate to="/login" replace />;
};

export default AuthGate;


