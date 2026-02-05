/**
 * === Fleetbo Developer Tutorial: The App Entry Point (App.jsx) ===
 *
 * This file is the main entry point for your React application.
 * It is responsible for three core tasks:
 *
 * 1. Startup Logic (`useStartupEffect`):
 * Handles the initial "handshake" with the native Fleetbo shell.
 * It shows an `InitializingScreen` while waiting for the native bridge to be ready.
 *
 * 2. Auth Context (`AuthProvider`):
 * Wraps the entire application to provide global session data.
 * This is populated by the `Login.jsx` gateway and can be accessed
 * by any component using the `useAuth()` hook.
 *
 * 3. Routing (`<Routes>`):
 * Defines all the pages in your application.
 * It uses `ProtectedRoute` to secure pages that require a user to be
 * authenticated, redirecting them to the `/login` gateway if not.
 *
 * --- Your Customization ---
 * - You will add all your new pages (Routes) here.
 * - You can customize the `InitializingScreen` to match your app's branding.
 */
import React from 'react';
import { Routes, Route, useLocation } from "react-router-dom";

// Context and internal logic
import { AuthProvider, AuthGate, useAuth, ProtectedRoute, ProtectedLayout } from '@fleetbo';

// Application pages
import Login from "./app/auth/Login";
import RouteAuth from "./app/auth/RouteAuth";

import Tab1 from "./app/tabs/Tab1";
import Tab2 from "./app/tabs/Tab2";
import Tab3 from "./app/tabs/Tab3";
import Navbar from "./app/tabs/Navbar";

import SetUser from "./app/items/User/SetUser";
import Insert from "./app/items/Insert";
import Item from "./app/items/Item";

import SampleMock from "./app/mocks/SampleMock";
import NotFound from './app/NotFound';

/* =======================================================================
    FLEETBO AUTO-GENERATION ZONE
    DO NOT DELETE OR MODIFY THE SECTION BELOW.
   ======================================================================= */

import TaskList from './app/TaskList';
import TaskCreate from './app/TaskCreate';
import TaskDetail from './app/TaskDetail';
// FLEETBO_IMPORTS

import Camera from './app/mocks/Camera';
import PermissionModule from './app/mocks/PermissionModule';
import OfflineSyncQueue from './app/mocks/OfflineSyncQueue';

import TaskScheduler from './app/mocks/TaskScheduler';
import SnapTaskList from './app/SnapTaskList';
// FLEETBO_MORE_IMPORTS

import { useStartupEffect } from '@fleetbo/hooks/useStartupEffect';

function AppContent() {

  const auth = useAuth();
  const location = useLocation();

  const isTechnicalRoute =
    location.pathname === '/navbar' ||
    window.location.hash.includes('navbar') ||
    location.pathname.includes('/mocks') ||
    window.location.hash.includes('mocks');

  if (!isTechnicalRoute) {
    const isLoading = auth ? auth.isLoading : true;
    if (isLoading) {
      return <InitializingScreen />;
    }
  }

  return (
    // Add Routes
    <Routes>
      <Route path="/" element={<AuthGate />} />

      <Route path="/auth/route" element={<RouteAuth />} />
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute><ProtectedLayout /></ProtectedRoute>}>
        <Route path="/tab1" element={<Tab1 />} />
        <Route path="/tab2" element={<Tab2 />} />
        <Route path="/tab3" element={<Tab3 />} />
      </Route>

      <Route path="/setuser" element={<ProtectedRoute><SetUser /></ProtectedRoute>} />
      <Route path="/insert" element={<ProtectedRoute><Insert /></ProtectedRoute>} />
      <Route path="/item/:id" element={<ProtectedRoute><Item /></ProtectedRoute>} />

      <Route path="/mocks/sample" element={<SampleMock />} />


      {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              New pages generated via 'npm run fleetbo page NamePage' will be inserted here.
              ======================================================================= */}

      <Route path="/tasklist" element={<TaskList />} />
      <Route path="/taskcreate" element={<TaskCreate />} />
      <Route path="/taskdetail" element={<TaskDetail />} />
      {/* FLEETBO_ROUTES */}

      {/* =======================================================================
              FLEETBO DYNAMIC ROUTES
              DO NOT DELETE THE ANCHOR BELOW.
              New pages generated via 'npm run fleetbo alex' will be inserted here.
              ======================================================================= */}

      <Route path="/mocks/camera" element={<Camera />} />
      <Route path="/mocks/permissionmodule" element={<PermissionModule />} />
      <Route path="/mocks/offlinesyncqueue" element={<OfflineSyncQueue />} />

      <Route path="/mocks/taskscheduler" element={<TaskScheduler />} />
      <Route path="/snaptasklist" element={<SnapTaskList />} />
      {/* FLEETBO_DYNAMIC ROUTES */}

      <Route path="*" element={<NotFound />} />
      <Route path="/navbar" element={<Navbar />} />
    </Routes>
  );
}

const InitializingScreen = ({ error }) => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
    {error ? (
      <>
        <i className="fa-solid fa-triangle-exclamation fa-3x text-danger mb-3"></i>
        <h5 className="text-danger">Connection Failed</h5>
        <p style={{ marginTop: '1rem', color: '#6c757d' }}>{error}</p>
        <button className="btn btn-outline-secondary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </>
    ) : (
      <>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </>
    )}
  </div>
);

function App() {
  const { isFleetboReady, initializationError } = useStartupEffect();

  //const isNavbarRoute = window.location.pathname === '/navbar';
  // On vérifie si le hash (#) contient le mot "navbar"
  const isNavbarRoute = window.location.hash.includes('navbar');

  if (isNavbarRoute) {
    return <AppContent />;
  }

  if (!isFleetboReady) {
    return <InitializingScreen error={initializationError} />;
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
