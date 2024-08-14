import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
    const userRole = parseInt(localStorage.getItem('rol'), 10); // Asume que el rol del usuario está almacenado en localStorage como número

    if (userRole !== requiredRole) {
        return <Navigate to="/login" />;
    }

    return <Component {...rest} />;
};

export default ProtectedRoute;
