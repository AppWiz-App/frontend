import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Upload from './Upload';
import { ReviewerEditor } from '../components/ReviewerEditor';
import { Customization } from '../components/Customization';
import { useNavigate } from 'react-router-dom';
import { CycleFormTabs } from '../components/CycleFormTabs';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';

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
  const { user } = useAuth();

  async function submitCycle() {
    try {
      // need to incorporate custom due date later
      const current_year = new Date().getFullYear();
      const application_due_date = new Date(`${current_year}-12-31T23:59:59Z`).toISOString();
      console.log(user);
      
      const { data, error } = await supabase
        .from('ApplicationCycle')
        .insert({
          num_apps: formState._applicantCount,
          reads_per_application: formState.customizations.reviewersPerApp,
          due_date: application_due_date,
          name: formState.customizations.name,
          created_by_user_id: user?.id,
        })
        .select();

      if (error) throw error;

      const new_entry_id = data[0]?.id;

      navigate(`/cycle/${new_entry_id}`);
    } 
    catch (error) {
      console.error('Failed to submit the form:', error);
    }
  }

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
            onClick={submitCycle}
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
