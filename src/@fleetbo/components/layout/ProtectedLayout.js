// src/components/layout/ProtectedLayout.js
import React from 'react';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
    return (
        <div className="app-container">
            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
};
export default ProtectedLayout;
