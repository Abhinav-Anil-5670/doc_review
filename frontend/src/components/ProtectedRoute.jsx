// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token found, redirect to login page
  if (!token) return <Navigate to="/" replace />;

  // If token exists, allow access
  return children;
}

export default ProtectedRoute;
