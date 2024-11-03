import { useContext } from 'react';
import { AuthContext } from '../utils/auth/AuthProvider';

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
