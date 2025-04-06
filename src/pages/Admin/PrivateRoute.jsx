import React from 'react';
import { Navigate } from 'react-router-dom';

// Protected route component
const PrivateRoute = ({ element, ...rest }) => {
    const token = localStorage.getItem('token'); // Check token in localStorage

    if (!token) {
        // If token is not found, redirect to login page
        return <Navigate to="/sonique/user/login" />;
    }

    return element;
};

export default PrivateRoute;
