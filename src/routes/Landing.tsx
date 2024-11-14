import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AppWizButton } from '../components/ui/AppWizButton';
import Logo from '../assets/LogoBlack.svg';

export function Landing() {
  const { session } = useAuth();

  if (session) {
    return <Navigate to='/home' replace={true} />;
  }

  return (
    <>
      <LandingHeader />

      <Hero />
    </>
  );
}

function LandingHeader() {
  return (
    <header className='w-full h-24 p-8 flex justify-between items-center'>
      <Link to='/home'>
        <Logo />
      </Link>

      <AppWizButton variant='outlined' color='primary' size='s' to='/login'>
        Sign in
      </AppWizButton>
    </header>
  );
}

function Hero() {
  return (
    <div>
      <div className='absolute top-0 left-0 w-full h-96 bg-slate-100 [z-index:-1] blur-3xl'>
        asldkfj
      </div>
      <div className='p-24 flex flex-col items-center gap-16'>
        <h1 className='text-6xl font-bold text-center leading-tight tracking-tight'>
          <span className='[color:#393F47]'>
            Manage your club’s applications
          </span>

          <br />

          <span className='[background-image:linear-gradient(to_bottom,#84B4F2,#4372AF)] [background-clip:text] [color:transparent]'>
            without ever touching a spreadsheet
          </span>
        </h1>

        <h3 className='[color:#6F7B8A] text-2xl'>
          AppWiz is the all-in-one applicant tracking system for student
          organizations
        </h3>

        <AppWizButton size='l' to='/login'>
          Try for free
        </AppWizButton>
      </div>

      <div className='flex justify-center gap-4'>
        <div className='w-96 h-96 bg-slate-100 rounded-lg'></div>
        <div className='w-96 h-96 bg-slate-100 rounded-lg'></div>
        <div className='w-96 h-96 bg-slate-100 rounded-lg'></div>
      </div>
    </div>
  );
}
