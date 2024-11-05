import { v4 as uuidv4 } from 'uuid';
import { FormState } from '../routes/NewApplicationCycle';
import { AppWizButton } from './ui/AppWizButton';
import {
  RiCloseCircleFill,
  RiCloseCircleLine,
  RiCloseFill,
} from '@remixicon/react';

export function ReviewerEditor({
  formState,
  setReviewers,
}: {
  formState: FormState;
  setReviewers: (newReviewers: FormState['reviewers']) => void;
}) {
  const reviewers = formState.reviewers;

  return (
    <div className='flex flex-col gap-2'>
      <h3 className='text-3xl font-bold'>Reviewers</h3>
      {reviewers.map(({ name, email, id }) => (
        <div key={id} className='flex gap-2'>
          <input
            className='border px-2 py-1 rounded bg-slate-50'
            placeholder='Name'
            value={name}
            onChange={(e) => {
              setReviewerById(id, { id, name: e.target.value, email });
            }}
          />
          <input
            className='border px-2 py-1 rounded bg-slate-50'
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setReviewerById(id, { id, name, email: e.target.value });
            }}
          />
          <AppWizButton
            size='sm'
            variant='outlined'
            icon={<RiCloseFill className='text-slate-600' />}
            onClick={() => deleteReviewer(id)}
          />
        </div>
      ))}

      <AppWizButton
        disabled={formState.reviewers.length > formState._applicantCount}
        onClick={addReviewer}
      >
        New reviewer
      </AppWizButton>
    </div>
  );

  function addReviewer() {
    setReviewers([...reviewers, { name: '', email: '', id: uuidv4() }]);
  }

  function deleteReviewer(id: string) {
    setReviewers(reviewers.filter((reviewer) => reviewer.id !== id));
  }

  function setReviewerById(
    id: string,
    newReviewer: FormState['reviewers'][number]
  ) {
    setReviewers(
      reviewers.map((reviewer) => (reviewer.id === id ? newReviewer : reviewer))
    );
  }
}
