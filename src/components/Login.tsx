import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export default function App() {
  const { session } = useAuth();

  if (!session) {
    return <AuthUI />;
  }

  return <Navigate to='/home' replace={true} />;
}

function AuthUI() {
  return (
    <div className='mt-8 w-96 max-w-full mx-auto px-4'>
      <Auth providers={[]} supabaseClient={supabase} />
    </div>
  );
}
