import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './index.light.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { UserContextProvider } from './context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <UserContextProvider>
    <App />
  </UserContextProvider>
  // </React.StrictMode>
);
