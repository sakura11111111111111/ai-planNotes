// PrivateRoute 组件 - 路由守卫
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
