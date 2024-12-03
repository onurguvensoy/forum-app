import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import './index.css'
import App from './App';
import { UserProvider } from "./utils/UserContext";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <UserProvider>
    <App /> 
    </UserProvider>
    </BrowserRouter>
   
);
