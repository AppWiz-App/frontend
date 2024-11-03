import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute() {
  const { session } = useAuth();

  console.log(session);

  return session ? <Outlet /> : <Navigate to='/login' replace={true} />;
}
