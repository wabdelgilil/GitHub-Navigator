import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { RepoProvider } from './context/RepoContext';
import { App } from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RepoProvider>
        <App />
      </RepoProvider>
    </AuthProvider>
  </React.StrictMode>
);
