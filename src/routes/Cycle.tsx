import { Navigate, useParams } from 'react-router-dom';
import { Results } from './Results';
import { AppWizButton } from '../components/ui/AppWizButton';
import '../index.css';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import * as Dialog from '@radix-ui/react-dialog';
import { RiCloseFill } from '@remixicon/react';

type Reviewer = {
  id: string;
  name: string;
  email: string;
  application_cycle_id: string;
};

export function Cycle() {
  const { id: cycleId } = useParams();

  const [reviewers, setReviewers] = useState<Reviewer[] | undefined>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedReviewerId, setSelectedReviewerId] = useState<
    string | undefined
  >();

  useEffect(() => {
    if (!cycleId) return;

    const fetchReviewers = async () => {
      const { data, error } = await supabase
        .from('Reviewer')
        .select('*')
        .eq('application_cycle_id', cycleId);

      if (error) {
        console.error('Error fetching reviewers:', error);
      } else {
        setReviewers(data);
      }
    };

    fetchReviewers();
  }, [cycleId]);

  if (!cycleId) {
    return <Navigate to='/home' replace={true} />;
  }

  console.log(
    reviewers?.find((reviewer) => reviewer.id === selectedReviewerId)?.id
  );

  return (
    <div className='p-12'>
      <Dialog.Root open={modalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className='bg-black opacity-50 fixed inset-0' />
          <Dialog.Content className='bg-white p-8 border fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 rounded-md'>
            <div className='flex justify-between mb-8'>
              <Dialog.Title className='text-2xl'>Read as?</Dialog.Title>
              <AppWizButton
                icon={<RiCloseFill />}
                variant='outlined'
                onClick={() => setModalOpen(false)}
              />
            </div>

            <Dialog.Description>
              <select
                className='border border-slate-300 p-2 rounded w-full text-xl bg-slate-50'
                value={
                  reviewers?.find(
                    (reviewer) => reviewer.id === selectedReviewerId
                  )?.name
                }
                onChange={(e) => {
                  console.log(e.target.value);
                  setSelectedReviewerId(e.target.value);
                }}
              >
                {reviewers?.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.name}
                  </option>
                ))}
              </select>

              <br />
              <br />

              <AppWizButton
                to={`/cycle/${cycleId}/read/${selectedReviewerId}`}
                className='w-full'
              >
                Continue to reading
              </AppWizButton>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <AppWizButton onClick={() => setModalOpen(true)}>
        Read applications
      </AppWizButton>

      <div>
        <h3 className='page-header'>Reviewers</h3>
        <ul className='pl-8'>
          {reviewers?.map((reviewer) => {
            return <li key={reviewer.id}>{reviewer.name}</li>;
          })}
        </ul>
      </div>

      <Results id={cycleId} />
    </div>
  );
}
