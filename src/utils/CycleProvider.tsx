import { createContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { Loading } from '../components/Loading';
import { Database } from '../../database.types';

type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];
type Reviewer = Database['public']['Tables']['Reviewer']['Row'];
type Application = Database['public']['Tables']['Application']['Row'];
type Rating = Database['public']['Tables']['Rating']['Row'];

export type CycleState = {
  applicationCycle: ApplicationCycle | undefined;
  reviewers: Reviewer[] | undefined;
  applications: Application[] | undefined;
  ratings: Rating[] | undefined;
};

const INITIAL_CYCLE_STATE: CycleState = {
  applicationCycle: undefined,
  reviewers: undefined,
  applications: undefined,
  ratings: undefined,
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
        .eq('application_cycle_id', cycleId);

      if (reviewerError) {
        console.error('Error fetching application data:', reviewerError);
      } else {
        setReviewers(reviewerData);
      }

      const { data: applicationData, error: applicationError } = await supabase
        .from('Application')
        .select('*')
        .eq('application_cycle_id', cycleId);
      if (applicationError) {
        console.error('Error fetching applications:', applicationError);
      } else {
        setApplications(applicationData);
      }

      const { data: ratingData, error: ratingError } = await supabase
        .from('Rating')
        .select('*')
        .in('application_id', applicationData?.map((app) => app.id) ?? []);
      if (ratingError) {
        console.error('Error fetching ratings:', ratingError);
      } else {
        setRatings(ratingData);
      }

      setLoading(false);
    })();
  }, [cycleId]);

  const contextValue = {
    applicationCycle,
    reviewers,
    applications,
    ratings,
  };

  return loading ? (
    <Loading />
  ) : (
    <CycleContext.Provider value={contextValue}>
      {children}
    </CycleContext.Provider>
  );
}
