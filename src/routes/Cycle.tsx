import { Navigate, useParams } from 'react-router-dom';
import { Results } from './Results';
import { Ranking } from './Ranking';
import { AppWizButton } from '../components/ui/AppWizButton';
import '../index.css';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import * as Dialog from '@radix-ui/react-dialog';
import { RiCloseFill } from '@remixicon/react';
import { Database } from '../../database.types';
import { Loading } from '../components/Loading';
import { CycleProvider } from '../utils/CycleProvider';

type Reviewer = Database['public']['Tables']['Reviewer']['Row'];
type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];

export function Cycle() {
  const { id: cycleId } = useParams();

  const [reviewers, setReviewers] = useState<Reviewer[] | undefined>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedReviewerId, setSelectedReviewerId] = useState<
    string | undefined
  >();
  const [applicationCycle, setApplicationCycle] =
    useState<ApplicationCycle | null>(null);

  useEffect(() => {
    if (!cycleId) return;

    (async () => {
      const { data, error } = await supabase
        .from('Reviewer')
        .select('*')
        .eq('application_cycle_id', cycleId);

      if (error) {
        console.error('Error fetching reviewers:', error);
      } else {
        setReviewers(data);
      }

      const { data: cycleData, error: cycleError } = await supabase
        .from('ApplicationCycle')
        .select('*')
        .eq('id', cycleId)
        .single();

      if (cycleError) {
        console.error('Error fetching application data:', cycleError);
      } else {
        setApplicationCycle(cycleData);
      }
    })();
  }, [cycleId]);

  if (!cycleId) {
    return <Navigate to='/home' replace={true} />;
  }

  if (!applicationCycle) return <Loading />;

  return (
    <div>
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
                {!selectedReviewerId && (
                  <option value=''>Select a reviewer</option>
                )}
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
                disabled={!selectedReviewerId}
              >
                Continue to reading
              </AppWizButton>
            </Dialog.Description>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className='w-full border bg-slate-50 p-8 flex justify-between items-center'>
        <h1 className='text-3xl text-slate-700'>{applicationCycle.name}</h1>

        <AppWizButton onClick={() => setModalOpen(true)}>
          Read applications
        </AppWizButton>
      </div>

      <CycleProvider cycleId={cycleId}>
        <div className='grid grid-cols-2'>
          <div>
            <h3 className='page-header'>Reviewers</h3>
            <ul className='pl-8'>
              {reviewers?.map((reviewer) => {
                return <li key={reviewer.id}>{reviewer.name}</li>;
              })}
            </ul>
          </div>

          <div>
            <h3 className='page-header'>Applicant Ranking</h3>
            <div className='p-8'>
              <Ranking />
            </div>
          </div>
        </div>
      </CycleProvider>

      {/* <Results id={cycleId} /> */}
    </div>
  );
}
