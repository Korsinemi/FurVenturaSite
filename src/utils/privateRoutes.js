// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element, isLoggedIn }) {
    if (!isLoggedIn) {
        return <Navigate to="/account" replace />;
    }
    return element;
}

export default PrivateRoute