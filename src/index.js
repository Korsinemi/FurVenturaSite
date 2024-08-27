import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App.js';

// Punto de entrada de la aplicación
const root = ReactDOM.createRoot(document.getElementById('furventura'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
