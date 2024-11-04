import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to='/login' replace={true} />;
  }

  return children ? <>{children}</> : <Outlet />;
}
