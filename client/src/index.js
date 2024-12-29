import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css'
import App from './App';
import { UserProvider } from "./utils/userProvider";
import { AuthProvider } from './utils/AutContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <AuthProvider>
    <UserProvider>
    <App /> 
    </UserProvider>
    </AuthProvider>
    </BrowserRouter>
   
);
