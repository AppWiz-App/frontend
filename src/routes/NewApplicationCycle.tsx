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

export function NewApplicationCycle() {
  const [activeStep, setActiveStep] = useState<number>(0);

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
        {activeStep === 0 && (<Upload onUpload={(file) => console.log('File uploaded:', file)} />)}
      </div>
      <div><button className="next-button" onClick={() => setActiveStep(prev => prev + 1)}>Next</button></div>
    </div>
  );
}
