import { supabase } from '../utils/supabase';

export default function Header() {
  return (
    <div className='header'>
      <div className='logo'>
        <a href='/home'>
          <img src='src/assets/logo_white.svg' />
        </a>
      </div>

      <button
        className='bg-slate-800 text-white px-2 py-1 rounded'
        onClick={() => supabase.auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}
