import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import App from './App';

// Clear session on app initialization as per requirement to force logout on reload
sessionStorage.removeItem('token');
sessionStorage.removeItem('user');
localStorage.removeItem('token');
localStorage.removeItem('user');

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);