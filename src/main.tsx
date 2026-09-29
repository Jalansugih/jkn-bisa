// Dedicated entry routing: /admin is mounted as a separate AdminApp.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminApp from './AdminApp.tsx';
import './index.css';
import { initGoogleAnalytics } from './lib/analytics';

initGoogleAnalytics();

const isAdminPath =
  window.location.pathname === '/admin' ||
  window.location.pathname.startsWith('/admin/');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdminPath ? <AdminApp /> : <App />}
  </StrictMode>,
);