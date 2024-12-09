import { createContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Loading } from '../components/Loading';
import { Database } from '../../database.types';

type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];
type Reviewer = Database['public']['Tables']['Reviewer']['Row'];
type Application = Database['public']['Tables']['Application']['Row'];
type Rating = Database['public']['Tables']['Rating']['Row'];
type Reviewer_Application =
  Database['public']['Tables']['Reviewer_Application']['Row'];

export type CycleState = {
  applicationCycle: ApplicationCycle | undefined;
  reviewers: Reviewer[] | undefined;
  applications: Application[] | undefined;
  ratings: Rating[] | undefined;
  assignments: Reviewer_Application[] | undefined;
};

const INITIAL_CYCLE_STATE: CycleState = {
  applicationCycle: undefined,
  reviewers: undefined,
  applications: undefined,
  ratings: undefined,
  assignments: undefined,
};
export const CycleContext = createContext<CycleState>(INITIAL_CYCLE_STATE);

export function CycleProvider({
  cycleId,
  children,
}: {
  cycleId: string;
  children: React.ReactNode;
}) {
  const [applicationCycle, setApplicationCycle] = useState<
    ApplicationCycle | undefined
  >();
  const [reviewers, setReviewers] = useState<Reviewer[] | undefined>();
  const [applications, setApplications] = useState<Application[] | undefined>();
  const [ratings, setRatings] = useState<Rating[] | undefined>();
  const [assignments, setAssignments] = useState<
    Reviewer_Application[] | undefined
  >();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    (async () => {
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

      const { data: reviewerData, error: reviewerError } = await supabase
        .from('Reviewer')
        .select('*')
        .limit(1000000)
        .eq('application_cycle_id', cycleId);

      if (reviewerError) {
        console.error('Error fetching application data:', reviewerError);
      } else {
        setReviewers(reviewerData);
      }

      const { data: applicationData, error: applicationError } = await supabase
        .from('Application')
        .select('*')
        .eq('application_cycle_id', cycleId)
        .limit(1000000);
      if (applicationError) {
        console.error('Error fetching applications:', applicationError);
      } else {
        setApplications(applicationData);
      }

      const { data: ratingData, error: ratingError } = await supabase
        .from('Rating')
        .select('*')
        .in('application_id', applicationData?.map((app) => app.id) ?? [])
        .limit(1000000);
      if (ratingError) {
        console.error('Error fetching ratings:', ratingError);
      } else {
        setRatings(ratingData);
      }

      console.log(
        'asdfasdf',
        reviewerData?.map((reviewer) => reviewer.id)
      );
      const { data: reviewerApplications, error: reviewerApplicationsError } =
        await supabase
          .from('Reviewer_Application')
          .select('*')
          .in('reviewer_id', reviewerData?.map((reviewer) => reviewer.id) ?? [])
          .limit(100000);

      console.log({ 'RIGHT HERE ASDF': reviewerApplications });
      if (reviewerApplicationsError) {
        console.error(
          'Error fetching reviewer applications:',
          reviewerApplicationsError
        );
      } else {
        setAssignments(reviewerApplications);
      }

      setLoading(false);
    })();
  }, [cycleId]);

  console.log({ assignments });

  const contextValue = {
    applicationCycle,
    reviewers,
    applications,
    ratings,
    assignments,
  };

  return loading ? (
    <Loading />
  ) : (
    <CycleContext.Provider value={contextValue}>
      {children}
    </CycleContext.Provider>
  );
}
