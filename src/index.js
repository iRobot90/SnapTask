import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';  
import './app/assets/css/App.css';
import App from './App'; 
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <HashRouter>
      <App />
    </HashRouter>
);

serviceWorkerRegistration.register();