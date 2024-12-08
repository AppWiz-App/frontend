import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { AppWizButton } from '../components/ui/AppWizButton';
import {
  RiArrowLeftLine,
  RiArrowRightLine,
  RiHome2Fill,
  RiHome2Line,
} from '@remixicon/react';
import * as Progress from '@radix-ui/react-progress';

export function Read() {
  const { id, reviewerId } = useParams();
  console.log('id', id);
  const [rating, setRating] = useState<number | null>(null);
  const [applicationData, setApplicationData] = useState(null);

  const [data, setData] = useState(null);

  async function findUser() {
    // const { data, error } = await supabase.auth.admin.getUserById(id);

    const { cycleData: ApplicationCycle, error } = await supabase
      .from('ApplicationCycle')
      .select('*');
    console.log(cycleData);

    const { data: reviewerData, error: reviewerError } = await supabase
      .from('Reviewer')
      .select('Reviewer.name')
      .eq('Reviewer.id', reviewerId);
    console.log(data);
    console.log(error);
  }

  findUser();

  return (
    <div className='[height:calc(100vh-72px)] flex flex-col'>
      <div className='w-full border bg-slate-50 p-8 flex justify-between items-center'>
        <h1 className='text-3xl text-slate-700'>
          Reading <b>MHacks 2024</b> Applications as <b>Peter Parker</b>
        </h1>

        <AppWizButton
          variant='outlined'
          to='/home'
          icon={<RiHome2Line />}
          iconSide='left'
        >
          Go home
        </AppWizButton>
      </div>

      <div className='grid [grid-template-columns:3fr_1fr] flex-grow'>
        <div className='p-8'>Application details</div>

        <div className='bg-slate--50 border-l p-8'>
          <h3 className='text-xl font-bold text-slate-700'>Your rating</h3>
          <p className='my-4'>1 is worst, 5 is best.</p>

          <div className='flex gap-1'>
            {Array(5)
              .fill(null)
              .map((_, i) => {
                const thisRating = i + 1;
                return (
                  <AppWizButton
                    variant={rating == thisRating ? 'filled' : 'outlined'}
                    onClick={() => setRating(thisRating)}
                    className='w-12'
                  >
                    {thisRating}
                  </AppWizButton>
                );
              })}
          </div>
        </div>
      </div>

      <div className='w-full border bg-slate-50 p-8 flex justify-between items-center'>
        <p className='text-xl'>
          Application <b>11</b> of <b>30</b>
        </p>

        <Progress.Root
          value={11}
          max={30}
          className='w-full h-4 bg-gray-200 rounded'
        >
          <Progress.Indicator className='bg-slate-600 h-full' />
        </Progress.Root>

        <div className='flex gap-2'>
          <AppWizButton
            icon={<RiArrowLeftLine />}
            onClick={() => alert('todo')}
            iconSide='left'
            variant='outlined'
            size='m'
          >
            Previous
          </AppWizButton>

          <AppWizButton
            icon={<RiArrowRightLine />}
            onClick={() => alert('todo')}
            size='m'
          >
            Save and next
          </AppWizButton>
        </div>
      </div>
    </div>
  );
}
