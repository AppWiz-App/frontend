import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Upload from './Upload';
import { ReviewerEditor } from '../components/ReviewerEditor';
import { Customization } from '../components/Customization';
import { useNavigate } from 'react-router-dom';
import { CycleFormTabs } from '../components/CycleFormTabs';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { AppWizButton } from '../components/ui/AppWizButton';
import { RiArrowRightLine } from '@remixicon/react';

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
      const application_due_date = new Date(
        `${current_year}-12-31T23:59:59Z`
      ).toISOString();
      console.log(user);

      const { data } = await supabase
        .from('ApplicationCycle')
        .insert({
          num_apps: formState._applicantCount,
          reads_per_application: formState.customizations.reviewersPerApp,
          due_date: application_due_date,
          name: formState.customizations.name,
          created_by_user_id: user?.id,
        })
        .select();

      const new_entry_id = data![0].id;

      console.log(
        formState.reviewers.map((reviewer) => ({
          ...reviewer,
          application_cycle_id: new_entry_id,
        }))
      );
      const { error } = await supabase
        .from('Reviewer')
        .insert(
          formState.reviewers.map((reviewer) => ({
            name: reviewer.name,
            email: reviewer.email,
            application_cycle_id: new_entry_id,
          }))
        )
        .select();

      console.log(data);

      if (error) {
        console.error(error);
      }

      navigate(`/cycle/${new_entry_id}`);
    } catch (error) {
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
          // @ts-expect-error: vercel build
          <ReviewerEditor formState={formState} setReviewers={setReviewers} />
        )}
        {activeStep === 2 && (
          <Customization formState={formState} setFormState={setFormState} />
        )}
      </div>
      <div>
        {activeStep < 2 ? (
          <AppWizButton
            className='absolute bottom-4 right-4'
            icon={<RiArrowRightLine />}
            disabled={!getCanContinue()}
            onClick={() => setActiveStep((prev) => prev + 1)}
          >
            Next
          </AppWizButton>
        ) : (
          <AppWizButton
            className='absolute bottom-4 right-4 bg-emerald-500'
            disabled={!getCanContinue()}
            onClick={submitCycle}
          >
            Submit
          </AppWizButton>
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

  function getCanContinue() {
    if (activeStep === 0) {
      return formState._applicantCount > 0;
    }

    if (activeStep === 1) {
      return (
        formState.reviewers.length > 0 &&
        formState.reviewers.every(
          (reviewer) => reviewer.name.length > 0 && reviewer.email.length > 0
        )
      );
    }

    if (activeStep === 2) {
      return formState.customizations.name.length;
    }
  }
}
