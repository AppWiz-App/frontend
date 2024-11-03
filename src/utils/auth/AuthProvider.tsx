import { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { Session, User } from '@supabase/supabase-js';
import Header from '../../components/Header';

export type AuthState = { session: Session | null; user: User | null };

const initialState: AuthState = { session: null, user: null };
export const AuthContext = createContext(initialState);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    setLoading(true);

    (async () => {
      const { data } = await supabase.auth.getSession();

      setAuthState({ session: data.session, user: data.session?.user ?? null });

      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthState({ session, user: session?.user ?? null });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return loading ? (
    <Loading />
  ) : (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

function Loading() {
  return (
    <div className='h-1/2 flex flex-col justify-center items-center gap-8'>
      <img src='src/assets/logo_black.svg' />

      <div className='flex flex-col items-center gap-2'>
        <p>This should only take a few moments...</p>
      </div>
    </div>
  );
}
