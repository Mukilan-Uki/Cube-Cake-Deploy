import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole, requireShop = false }) => {
  const { isAuthenticated, loading, user, hasRole, isShopOwnerWithShop } = useAuth();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-apricot" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Checking authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-selection" replace />;
  }

  // Check for specific role if required
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" replace />;
  }

  // Check if shop owner has registered shop
  if (requireShop && !isShopOwnerWithShop()) {
    return <Navigate to="/shop/register" replace />;
  }

  return children;
};

export default ProtectedRoute;