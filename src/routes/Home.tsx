import { useNavigate } from 'react-router-dom';
import { AppWizButton } from '../components/ui/AppWizButton';
import { RiAddFill, RiContactsBook2Fill } from '@remixicon/react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabase';
import { useCallback, useEffect, useState } from 'react';
import { Database } from '../../database.types';
import pluralize from 'pluralize';
import { formatDate } from 'date-fns';
import { RiArrowRightLine } from '@remixicon/react';

type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];

export function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cycles, setCycles] = useState<ApplicationCycle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getCycles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('ApplicationCycle')
      .select('*')
      .eq('created_by_user_id', user?.id);
    setLoading(false);

    if (error) return [];

    return data as ApplicationCycle[];
  }, [user?.id]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      if (!ignore) setCycles(await getCycles());
    })();

    return () => {
      ignore = true;
    };
  }, [getCycles]);

  return (
    <div className='w-full p-16 flex flex-col gap-8 bg-slate-50 [height:calc(100%-72px)]'>
      <header className='flex justify-between'>
        <h1 className='text-3xl font-bold text-slate-600'>
          Application cycles
        </h1>

        <AppWizButton
          variant='filled'
          size='md'
          icon={<RiAddFill />}
          onClick={() => {
            navigate('/new-cycle');
          }}
        >
          New application cycle
        </AppWizButton>
      </header>

      <ApplicationCycles />
    </div>
  );

  function ApplicationCycles() {
    if (loading) {
      return (
        <CycleContainer>
          {Array.from({ length: 4 }).map(() => (
            <div className='bg-slate-100 w-full h-52 animation-pulse rounded-lg'></div>
          ))}
        </CycleContainer>
      );
    }

    if (cycles.length === 0) {
      return <EmptyState />;
    }

    return (
      <CycleContainer>
        {cycles.map((cycle) => (
          <CycleCard cycle={cycle} />
        ))}
      </CycleContainer>
    );
  }
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
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
      {children}
    </div>
  );
}

function CycleCard({ cycle }: { cycle: ApplicationCycle }) {
  const navigate = useNavigate();

  return (
    <div className='bg-white border border-slate-300 py-8 px-6 rounded-lg flex flex-col gap-4'>
      <h3 className='text-xl font-bold'>{cycle.name}</h3>

      <div>
        <p className='text-slate-500'>
          {cycle.num_apps} {pluralize('application', cycle.num_apps)}
        </p>

        <p className='text-slate-500'>
          Created {formatDate(new Date(cycle.created_at), 'MMM d, yyyy')}
        </p>
      </div>

      <AppWizButton
        variant='outlined'
        icon={<RiArrowRightLine />}
        iconSide='right'
        onClick={() => {
          navigate('/cycle/' + cycle.id);
        }}
      >
        Open
      </AppWizButton>
    </div>
  );
}
