// src/@fleetbo/index.js

// Config
export { fleetboDB } from './config/fleetboConfig';

// Context
export { AuthProvider, useAuth } from './context/AuthContext';

// Hooks
export { useLoadingTimeout } from './hooks/useLoadingTimeout';
export { useStartupEffect } from './hooks/useStartupEffect';

// Components - Common
export { default as Loader } from './components/common/Loader';
export { default as PageConfig } from './components/common/PageConfig';

// Components - Layout (AJOUTÉS)
export { default as AuthGate } from './context/AuthGate';
export { default as ProtectedRoute } from './components/layout/ProtectedRoute';
export { default as ProtectedLayout } from './components/layout/ProtectedLayout';

// Utils
export { formatFirestoreDate } from './utils/FormatDate';