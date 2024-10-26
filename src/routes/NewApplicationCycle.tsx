import { useState } from 'react';
import Upload from './Upload';
import { ReviewerEditor } from '../components/ReviewerEditor';
import { Customization } from '../components/Customization';

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
  reviewers: {
    name: string, 
    email: string
  }[],
  customizations: {
    name: string,
    reviewersPerApp: number
  },
  // metadata
  _applicantCount: number,
}

const INITIAL_FORM_STATE: FormState = {
  reviewers: [],
  customizations: {
    name: '',
    reviewersPerApp: 3
  },
  // metadata
  _applicantCount: 0,
};

export function NewApplicationCycle() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

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
        {activeStep === 1 && (<ReviewerEditor formState={formState} setReviewers={setReviewers} />)}
        {activeStep === 2 && (<Customization formState={formState} setFormState={setFormState} />)} 
      </div>
      <div><button className="next-button" onClick={() => setActiveStep(prev => prev + 1)}>Next</button></div>
    </div>
  );

  function onCsvUpload(data: Record<string, string>[]) {
    console.log(data.length)
    setFormState(prev => ({...prev, _applicantCount: data.length}));
  }
  
  function setReviewers(newReviewers) {
    // sets reviewers in form state
    setFormState(prev => ({...prev, reviewers: newReviewers}))
  }
}
