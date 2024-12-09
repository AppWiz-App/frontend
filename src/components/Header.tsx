import { supabase } from '../utils/supabase';
import Logo from '../assets/LogoWhite.svg';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <div className='header sticky top-0'>
      <div className='logo'>
        <Link to='/home'>
          <Logo />
        </Link>
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
