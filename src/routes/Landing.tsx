import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function Landing() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to='/home' replace={true} />;
  }

  return (
    <div>
      <h1>Welcome to the landing page! You are signed out.</h1>
    </div>
  );
}
