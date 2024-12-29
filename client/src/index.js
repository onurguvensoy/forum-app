import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css'
import App from './App';
import { UserProvider } from "./utils/userProvider";
import { AuthProvider } from './utils/AutContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <HashRouter basename={process.env.REACT_APP_BASE_PATH}>
    <AuthProvider>
      <UserProvider>
        <App /> 
      </UserProvider>
    </AuthProvider>
  </HashRouter>
);
