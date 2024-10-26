import { useState } from 'react';
import Upload from './Upload';

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

type FormState = {
  applicantCount: number,
  reviewers: {
    name: string, 
    email: string
  }[],
  customizations: {
    name: string,
    reviewersPerApp: number
  }
}

let formState: FormState = {
  applicantCount: 0,
  reviewers: [],
  customizations: {
    name: '',
    reviewersPerApp: 0
  }
};

function onCsvUpload(data: Record<string, any>[]) {
  console.log('File uploaded:', data);
  // sets form state
  formState.applicantCount = data.length;
  console.log('Number of rows:', formState.applicantCount);
}

function setReviewers(newReviewers) {
  // sets reviewers in form state
  setFormState(prev => ({...formState, reviewers: newReviewers}))
}

export function NewApplicationCycle() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState({});

  return (
    <div>
      <div className='grid grid-cols-3'>
        {STEPS.map((step, index) => (
          <button
            className={`border bg-black text-white px-4 py-2 ${
              index === activeStep ? 'font-bold' : ''
            }`}
            onClick={() => setActiveStep(index)}
          >
            {index + 1} {step.label}
          </button>
        ))}
      </div>
      <div>
        {activeStep === 0 && (<Upload onUpload={onCsvUpload} />)}
      </div>
      <div><button className="next-button" onClick={() => setActiveStep(prev => prev + 1)}>Next</button></div>
    </div>
  );
}
