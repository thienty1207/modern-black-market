import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useBackendAuthContext } from '../contexts/BackendAuthContext';
import { Spinner } from './ui/spinner';

interface AuthenticatedRouteProps {
  redirectTo?: string;
}

export function AuthenticatedRoute({ redirectTo = '/login' }: AuthenticatedRouteProps) {
  const { isLoading, isValidated, error } = useBackendAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" className="text-primary" />
        <span className="ml-2">Authenticating...</span>
      </div>
    );
  }

  if (!isValidated) {
    console.error('Backend authentication failed:', error);
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
} 