import { useNavigate } from 'react-router-dom';
import { AppWizButton } from '../components/ui/AppWizButton';
import { RiContactsBook2Fill } from '@remixicon/react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import { useCallback, useEffect, useState } from 'react';
import { Database } from '../../database.types';
import pluralize from 'pluralize';
import { formatDate } from 'date-fns';

type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cycles, setCycles] = useState<ApplicationCycle[]>([]);

  const getCycles = useCallback(async () => {
    const { data, error } = await supabase
      .from('ApplicationCycle')
      .select('*')
      .eq('created_by_user_id', user?.id);

    if (error) return [];

    return data as ApplicationCycle[];
  }, [user?.id]);

  useEffect(() => {
    (async () => {
      setCycles(await getCycles());
    })();
  }, [getCycles]);

  console.log(cycles);

  return (
    <div className='w-full p-16 flex flex-col gap-8 bg-slate-50 [height:calc(100%-72px)]'>
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

      {cycles.length > 0 ? (
        <CycleContainer>
          {cycles.map((cycle) => (
            <CycleCard cycle={cycle} />
          ))}
        </CycleContainer>
      ) : (
        <EmptyState />
      )}
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

function CycleContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
      {children}
    </div>
  );
}

function CycleCard({ cycle }: { cycle: ApplicationCycle }) {
  return (
    <div className='bg-white border border-slate-300 py-8 px-6 rounded-lg'>
      <h3 className='text-xl font-bold mb-4'>{cycle.name}</h3>

      <p className='text-slate-500'>
        {cycle.num_apps} {pluralize('application', cycle.num_apps)}
      </p>

      <p className='text-slate-500'>
        Created {formatDate(new Date(cycle.created_at), 'MMM d, yyyy')}
      </p>
    </div>
  );
}
