import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import Header from '../components/Header';

export function ProtectedBase() {
  return (
    <ProtectedRoute>
      <Header />
      <Outlet />
    </ProtectedRoute>
  );
}
