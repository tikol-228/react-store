import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  const loginUrl = `/login?redirect=${encodeURIComponent(location.pathname)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1B4B43]/20 border-t-[#1B4B43] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={loginUrl} replace />;
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent('/admin')}&adminDenied=1`}
        replace
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
