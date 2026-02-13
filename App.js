// App.js - Fleetbo App Entry Point
// Fleetbo handles routing automatically - we just export screens
import React from 'react';

// Default export - Fleetbo will render this initially or use it as fallback
const App = () => {
  console.log('App: Fleetbo Task Manager initialized');
  console.log('App: Fleetbo object exists:', typeof window.Fleetbo !== 'undefined');
  
  // Fleetbo handles routing - this component may not be rendered
  // but it's required as default export
  return null;
};

export default App;

// Export screens for Fleetbo's routing system
// Fleetbo.openPage('pagename') will find these exports
export { default as CoreScreen } from './src/app/CoreScreen';
export { default as TaskList } from './src/app/TaskList';
export { default as TaskCreate } from './src/app/TaskCreate';
export { default as TaskDetail } from './src/app/TaskDetail';
export { default as ProfileScreen } from './src/app/ProfileScreen';
export { default as NotFoundScreen } from './src/app/NotFoundScreen';
export { default as CameraModule } from './CameraModule'; // Export the CameraModule

// Export with Fleetbo page name aliases (lowercase)
export { default as core } from './src/app/CoreScreen';
export { default as tasklist } from './src/app/TaskList';
export { default as taskcreate } from './src/app/TaskCreate';
export { default as taskdetail } from './src/app/TaskDetail';
export { default as profile } from './src/app/ProfileScreen';
export { default as notfound } from './src/app/NotFoundScreen';
export { default as cameramodule } from './CameraModule'; // Add alias for CameraModule