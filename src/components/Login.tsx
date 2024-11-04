import { Auth } from '@supabase/auth-ui-react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import LogoBlack from '../assets/LogoBlack.svg';

export default function App() {
  const { session } = useAuth();

  if (!session) {
    return <AuthUI />;
  }

  return <Navigate to='/home' replace={true} />;
}

function AuthUI() {
  return (
    <div className='mt-32 w-96 max-w-full mx-auto px-4 flex flex-col justify-center items-center gap-8'>
      <LogoBlack />

      <Auth providers={[]} supabaseClient={supabase} />
    </div>
  );
}