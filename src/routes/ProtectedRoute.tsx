import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { session } = useAuth();

  return session ? <Outlet /> : <Navigate to='/login' replace={true} />;
}
