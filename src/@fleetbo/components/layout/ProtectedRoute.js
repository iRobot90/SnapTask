// src/components/layout/ProtectedRoute.js

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@fleetbo';

const ProtectedRoute                = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();
    const location                  = useLocation();
    if (isLoading) { return null; }
    if (!isLoggedIn) {  return <Navigate to="/login" state={{ from: location }} replace />; }
    return children;
};
export default ProtectedRoute;


