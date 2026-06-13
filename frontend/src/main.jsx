import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/index.css';
import { registerServiceWorker } from './pwa.js';

// Dynamically trigger backend to copy the uploaded logo to public/logo.jpg on load
fetch('/api/orders/copy-logo-trigger')
  .then(r => r.json())
  .then(data => console.log('Logo Sync:', data))
  .catch(e => console.error('Logo Sync Error:', e));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();
