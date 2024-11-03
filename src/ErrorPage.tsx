import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div className='h-1/2 flex flex-col justify-center items-center gap-8'>
      <h1 className='text-6xl'>404</h1>

      <div className='flex flex-col items-center gap-2'>
        <p>Oops! This page doesn’t exist.</p>

        <Link to='/' className='text-sky-600'>
          Go home
        </Link>
      </div>
    </div>
  );
}
