import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Upload from './Upload';
import { ReviewerEditor } from '../components/ReviewerEditor';
import { Customization } from '../components/Customization';
import { useNavigate } from 'react-router-dom';
import { CycleFormTabs } from '../components/CycleFormTabs';

const STEPS = [
  {
    label: 'Add applicants',
  },
  {
    label: 'Add reviewers',
  },
  {
    label: 'Customize',
  },
];

export type FormState = {
  reviewers: {
    name: string;
    email: string;
    id: string;
  }[];
  customizations: {
    name: string;
    reviewersPerApp: number;
  };
  // metadata
  _applicantCount: number;
};

const INITIAL_FORM_STATE: FormState = {
  reviewers: [{ name: '', email: '', id: uuidv4() }],
  customizations: {
    name: '',
    reviewersPerApp: 3,
  },
  // metadata
  _applicantCount: 0,
};

export function NewApplicationCycle() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const navigate = useNavigate();

  return (
    <div>
      <CycleFormTabs
        steps={STEPS}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
      <div className='h-full flex justify-center items-center p-16'>
        {activeStep === 0 && <Upload onUpload={onCsvUpload} />}
        {activeStep === 1 && (
          <ReviewerEditor formState={formState} setReviewers={setReviewers} />
        )}
        {activeStep === 2 && (
          <Customization formState={formState} setFormState={setFormState} />
        )}
      </div>
      <div>
        {activeStep < 2 ? (
          <button
            className='next-button'
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </button>
        ) : (
          <button
            className='next-button'
            onClick={() => navigate('/results', { state: formState })}
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );

  function onCsvUpload(data: Record<string, string>[]) {
    setFormState((prev) => ({ ...prev, _applicantCount: data.length }));
  }

  function setReviewers(newReviewers: FormState['reviewers']) {
    // sets reviewers in form state
    setFormState((prev) => ({ ...prev, reviewers: newReviewers }));
  }
}
