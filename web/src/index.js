import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './views/App';
import { AuthContextProvider } from './viewmodels/context/AuthContext';


ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
    
    <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);