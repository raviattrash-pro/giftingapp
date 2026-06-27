import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { registerServiceWorker } from './pwa.js';
import { GoogleOAuthProvider } from '@react-oauth/google';

// IMPORTANT: Replace with actual Google Client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'placeholder-client-id';

// Dynamically trigger backend to copy the uploaded logo to public/logo.jpg on load
fetch('/api/orders/copy-logo-trigger').catch(() => {});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

registerServiceWorker();
