import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  </React.StrictMode>
);

// Register Service Worker for 100% Offline PWA functionality
serviceWorkerRegistration.register();

reportWebVitals();
