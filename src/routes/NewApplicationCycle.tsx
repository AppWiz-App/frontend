import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Upload from './Upload';
import { ReviewerEditor } from '../components/ReviewerEditor';
import { Customization } from '../components/Customization';
import { useNavigate } from 'react-router-dom';
import { CycleFormTabs } from '../components/CycleFormTabs';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { AppWizButton } from '../components/ui/AppWizButton';
import { RiArrowRightLine, RiLoader2Line } from '@remixicon/react';

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
  _csvRows: Record<string, string>[];
};

const INITIAL_FORM_STATE: FormState = {
  reviewers: [{ name: '', email: '', id: uuidv4() }],
  customizations: {
    name: '',
    // fixme: bug, this should be reduced if #reviewers is less than 3
    reviewersPerApp: 3,
  },
  // metadata
  _applicantCount: 0,
  _csvRows: [],
};

export function NewApplicationCycle() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [loading, setLoading] = useState<boolean>(false);

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

      const { data: cycleData, error: cycleError } = await supabase
        .from('ApplicationCycle')
        .insert({
          num_apps: formState._applicantCount,
          reads_per_application: formState.customizations.reviewersPerApp,
          due_date: application_due_date,
          name: formState.customizations.name,
          created_by_user_id: user?.id,
        })
        .limit(1000000)
        .select('*');
      console.log({ cycleData });

      if (cycleError) {
        console.error('Failed to create application cycle:', cycleError);
        return;
      }

      const new_cycle_id = cycleData![0].id;

      const { data: reviewerData, error: reviewerError } = await supabase
        .from('Reviewer')
        .insert(
          formState.reviewers.map((reviewer) => ({
            name: reviewer.name,
            email: reviewer.email,
            application_cycle_id: new_cycle_id,
          }))
        )
        .limit(1000000)
        .select('*');
      console.log({ reviewerData });

      if (reviewerError) {
        console.error('Failed to insert reviewers:', reviewerError);
        return;
      }

      // console.log("reviewer data: ", reviewerData);

      const { data: applicationData, error: applicationError } = await supabase
        .from('Application')
        .insert(
          formState._csvRows.map((row) => ({
            app_data: row,
            application_cycle_id: new_cycle_id,
          }))
        )
        .limit(1000000)
        .select('*');

      console.log({ applicationData });

      if (applicationError) {
        console.error('Failed to insert applications:', applicationError);
        return;
      }

      console.log(cycleData);
      console.log(applicationData);
      console.log(reviewerData);

      const reviewerCount = reviewerData.length;
      const applicantCount = cycleData[0].num_apps;
      const reviewersPerApp = cycleData[0].reads_per_application;

      console.log({ reviewerCount });
      console.log({ applicantCount });
      console.log({ reviewersPerApp });

      let ac = 0;

      const applicationsPerReviewer = Math.ceil(
        (applicantCount * reviewersPerApp) / reviewerCount
      );

      async function assignReviewer(pushItems) {
        try {
          const { data, error } = await supabase
            .from('Reviewer_Application')
            .insert(pushItems)
            .select('*')
            .limit(1000000);
          console.log({ 'ERROR HERE': error });
          if (error) {
            console.log('ERROR: ', error);
          }
          return data; // optional
        } catch (error) {
          console.error('Error inserting reviewer application:', error);
          throw error;
        }
      }

      for (let i = 0; i < reviewerCount; i++) {
        const reviewerId = reviewerData[i].id;

        const myAssignments = [];

        const maxApp = ac + applicationsPerReviewer - 1;
        myAssignments.push([ac, Math.min(applicantCount - 1, maxApp)]);

        const pushItems = [];

        for (let j = ac; j <= Math.min(applicantCount - 1, maxApp); j++) {
          const applicationId = applicationData[j].id;
          console.log('APPLICATION ID: ', applicationId);

          pushItems.push({
            reviewer_id: reviewerId,
            application_id: applicationId,
          });

          // assignReviewer(reviewerId, applicationId)
          //   .then((assignment) => {
          //     console.log('Reviewer assigned:', assignment);
          //   })
          //   .catch((error) => {
          //     console.error('Error assigning reviewer:', error);
          //   });
          // await new Promise((resolve) => setTimeout(resolve, 10));
        }

        if (maxApp > applicantCount - 1 && i !== reviewerCount - 1) {
          console.log('before for loop');
          myAssignments.push([0, maxApp - applicantCount]);
          for (let j = 0; j <= maxApp - applicantCount; j++) {
            const applicationId = applicationData[j].id;
            console.log('APPLICATION ID: ', applicationId);

            pushItems.push({
              reviewer_id: reviewerId,
              application_id: applicationId,
            });
            // assignReviewer(reviewerId, applicationId)
            //   .then((assignment) => {
            //     console.log('Reviewer assigned:', assignment);
            //   })
            //   .catch((error) => {
            //     console.error('Error assigning reviewer:', error);
            //   });
            // await new Promise((resolve) => setTimeout(resolve, 10));
          }
          console.log('after for loop');
          ac = maxApp - applicantCount + 1;
        } else if (maxApp === applicantCount - 1) {
          ac = 0;
        } else {
          ac += applicationsPerReviewer;
        }

        console.log({ pushItems });
        assignReviewer(pushItems)
          .then((assignment) => {
            console.log('Reviewer assigned:', assignment);
          })
          .catch((error) => {
            console.error('Error assigning reviewer:', error);
          });
      }

      // console.log("application data: ", applicationData);

      // linking reviewer id to application id
      // useEffect(() => {
      //   const fetchReviewers = async () => {
      //     const { data, error } = await supabase
      //       .from('Reviewer')
      //       .select('id')
      //       .eq('application_cycle_id', id);

      //     if (error) {
      //       console.error('Error fetching reviewers:', error);
      //     } else {
      //       // @ts-expect-error: vercel build
      //       setReviewers(data);
      //     }
      //   };

      //   fetchReviewers();
      // }, [id]);

      // useEffect(() => {
      //   const fetchApplications = async () => {
      //     const { data, error } = await supabase
      //       .from('Application')
      //       .select('id')
      //       .eq('application_cycle_id', id);

      //     if (error) {
      //       console.error('Error fetching reviewers:', error);
      //     } else {
      //       // @ts-expect-error: vercel build
      //       setApplications(data);
      //     }
      //   };

      //   fetchApplications();
      // }, [id]);

      // wait 2 seconds for our supabase assignments to complete
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      return new_cycle_id;
    } catch (error) {
      return Promise.reject(error);
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
            disabled={!getCanContinue() || loading}
            icon={
              loading ? (
                <div className='animate-spin	'>
                  <RiLoader2Line />
                </div>
              ) : undefined
            }
            iconSide='left'
            onClick={() => {
              setLoading(true);
              submitCycle()
                .then((new_cycle_id) => {
                  console.log('Cycle and applications created successfully');
                  setLoading(false);
                  // navigate(`/cycle/${new_cycle_id}`);
                })
                .catch((error) => {
                  setLoading(false);
                  console.error('failed', error);
                });
            }}
          >
            Submit
          </AppWizButton>
        )}
      </div>
    </div>
  );

  function onCsvUpload(data: Record<string, string>[]) {
    setFormState((prev) => {
      const updatedState = {
        ...prev,
        _applicantCount: data.length,
        _csvRows: data,
      };
      //console.log(updatedState._csvRows);
      return updatedState;
    });
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
