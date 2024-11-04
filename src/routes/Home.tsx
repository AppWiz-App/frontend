import { useNavigate } from 'react-router-dom';
import { AppWizButton } from '../components/ui/AppWizButton';
import { RiContactsBook2Fill } from '@remixicon/react';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className='w-full p-16 flex flex-col gap-8'>
      <header className='flex justify-between'>
        <h1 className='text-3xl font-bold text-slate-600'>
          Application cycles
        </h1>

        <AppWizButton
          variant='filled'
          size='md'
          onClick={() => {
            navigate('/new-cycle');
          }}
        >
          New application cycle
        </AppWizButton>
      </header>

      <EmptyState />
    </div>
  );
}

function EmptyState() {
  return (
    <div className='min-h-96 bg-slate-200 rounded-lg flex flex-col gap-4 justify-center items-center'>
      <RiContactsBook2Fill className='text-slate-400' size={64} />

      <strong className='text-slate-400 text-xl'>
        You haven’t created any application cycles yet.
      </strong>
    </div>
  );
}
