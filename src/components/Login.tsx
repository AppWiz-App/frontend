import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

const supabase = createClient(
  'https://afloodcyekmrsaclcnjj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmbG9vZGN5ZWttcnNhY2xjbmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwMTAwNDgsImV4cCI6MjA0NDU4NjA0OH0.KcJg6Y80u3pTqC9C0trhrcxu3GSUUUUf0Ib28pbX6IQ'
);

export default function App() {
  const [session, setSession] = useState(null);

  fetch('http://localhost:3000/');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}
