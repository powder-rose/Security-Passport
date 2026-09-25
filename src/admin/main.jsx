import React from 'react';
import { createRoot } from 'react-dom/client';

import AdminApp from './AdminApp.jsx';
import {
  AuthProvider,
} from './auth/AuthProvider.jsx';

import './styles/admin.css';


createRoot(
  document.getElementById('admin-root'),
).render(
  <React.StrictMode>
    <AuthProvider>
      <AdminApp />
    </AuthProvider>
  </React.StrictMode>,
);
