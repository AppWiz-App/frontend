import { v4 as uuidv4 } from 'uuid';

import { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import { AppWizButton } from '../components/ui/AppWizButton';
import {
  RiArrowGoBackLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckboxMultipleFill,
  RiLoader2Line,
} from '@remixicon/react';
import * as Progress from '@radix-ui/react-progress';

import { Loading } from '../components/Loading';
import { Database } from '../../database.types';

type ApplicationCycle = Database['public']['Tables']['ApplicationCycle']['Row'];
type Reviewer = Database['public']['Tables']['Reviewer']['Row'];
type Application = Database['public']['Tables']['Application']['Row'];
// type Rating = Database['public']['Tables']['Rating']['Insert'];

type RatingObj = {
  numeric: number;
  id: string;
};

export function Read() {
  const { id, reviewerId } = useParams();

  const [applicationCycle, setApplicationCycle] =
    useState<ApplicationCycle | null>(null);
  const [reviewer, setReviewer] = useState<Reviewer | null>(null);

  const [activeApplicationIndex, setActiveApplicationIndex] = useState<
    number | undefined
  >();
  const [assignedCount, setAssignedCount] = useState<number | undefined>();
  const [applications, setApplications] = useState<Application[]>();
  const [ratings, setRatings] = useState<Record<Application['id'], RatingObj>>(
    {}
  );

  const [isSubmittingRating, setIsSubmittingRating] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const { data: cycleData, error: cycleError } = await supabase
        .from('ApplicationCycle')
        .select('*')
        .eq('id', id)
        .single();

      if (cycleError) {
        console.error('Error fetching application data:', cycleError);
      } else {
        setApplicationCycle(cycleData);
      }

      const { data: reviewerData, error: reviewerError } = await supabase
        .from('Reviewer')
        .select('*')
        .eq('id', reviewerId)
        .single();

      if (reviewerError) {
        console.error('Error fetching application data:', reviewerError);
      } else {
        setReviewer(reviewerData);
      }

      const { data: ratingData, error: ratingError } = await supabase
        .from('Rating')
        .select('*')
        .eq('reviewer_id', reviewerId)
        .order('application_id');
      if (ratingError) {
        console.error('Error fetching ratings:', ratingError);
      } else {
        console.log({ ratingData });
        const ratingRecord = ratingData.reduce((acc, rating) => {
          acc[rating.application_id] = { ...rating.rating, id: rating.id };
          return acc;
        }, {});
        setRatings(ratingRecord);
        console.log({ ratingRecord });
        setActiveApplicationIndex(ratingData.length);
      }

      const { data: reviewerApplications, error: reviewerApplicationsError } =
        await supabase
          .from('Reviewer_Application')
          .select('application_id')
          .eq('reviewer_id', reviewerId);

      if (reviewerApplicationsError) {
        console.error(
          'Error fetching reviewer applications:',
          reviewerApplicationsError
        );
      }

      if (!reviewerApplications) return;
      const applicationIds = reviewerApplications.map(
        (ra) => ra.application_id
      );
      setAssignedCount(applicationIds.length);

      const { data: applications, error: applicationsError } = await supabase
        .from('Application')
        .select('*')
        .in('id', applicationIds)
        .order('id');
      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
      } else {
        console.log(applications);
        setApplications(applications);
      }
    })();
  }, [id, reviewerId]);

  if (
    !applicationCycle ||
    !reviewer ||
    assignedCount === undefined ||
    activeApplicationIndex === undefined ||
    !applications ||
    ratings === undefined
  )
    return <Loading />;

  if (activeApplicationIndex >= assignedCount) {
    return <DoneReading />;
  }

  const activeApplicationRating =
    ratings[applications[activeApplicationIndex].id];

  return (
    <div className='[height:calc(100vh-72px)] flex flex-col'>
      <div className='w-full border bg-slate-50 p-8 flex justify-between items-center'>
        <h1 className='text-3xl text-slate-700 truncate text-ellipsis'>
          Reading <b>{applicationCycle.name}</b> Applications as{' '}
          <b>{reviewer.name}</b>
        </h1>

        <AppWizButton
          variant='outlined'
          to='/home'
          icon={<RiArrowGoBackLine />}
          iconSide='left'
        >
          Exit reading
        </AppWizButton>
      </div>

      <div className='grid [grid-template-columns:3fr_1fr] flex-grow'>
        <div className='p-8 w-96'>
          {JSON.stringify(applications[activeApplicationIndex])}
        </div>

        <div className='bg-slate-50 border-l p-8'>
          <h3 className='text-xl font-bold text-slate-700'>Your rating</h3>
          <p className='my-4'>1 is worst, 5 is best.</p>

          <div className='flex gap-1'>
            {Array(5)
              .fill(null)
              .map((_, i) => {
                const thisRating = i + 1;
                return (
                  <AppWizButton
                    variant={
                      activeApplicationRating?.numeric === thisRating
                        ? 'filled'
                        : 'outlined'
                    }
                    onClick={() =>
                      onRatingChange(
                        Number(thisRating),
                        applications[activeApplicationIndex].id
                      )
                    }
                    className='w-12'
                  >
                    {thisRating}
                  </AppWizButton>
                );
              })}
          </div>
        </div>
      </div>

      <div className='w-full border bg-slate-50 p-8 flex flex-col gap-4'>
        <div className='flex justify-between items-center'>
          <p className='text-xl'>
            Application <b>{activeApplicationIndex + 1}</b> of{' '}
            <b>{assignedCount}</b>
          </p>

          <div className='flex gap-2'>
            <AppWizButton
              icon={<RiArrowLeftLine />}
              onClick={() => setActiveApplicationIndex((prev) => prev! - 1)}
              iconSide='left'
              variant='outlined'
              size='m'
              disabled={activeApplicationIndex === 0}
            >
              Previous
            </AppWizButton>

            <AppWizButton
              onClick={onSaveAndNext}
              size='m'
              disabled={
                !ratings[applications[activeApplicationIndex].id] ||
                isSubmittingRating
              }
              icon={
                isSubmittingRating ? (
                  <div className='animate-spin	'>
                    <RiLoader2Line />
                  </div>
                ) : (
                  <RiArrowRightLine />
                )
              }
              iconSide='right'
            >
              Save{activeApplicationIndex < assignedCount - 1 && ' and next'}
            </AppWizButton>
          </div>
        </div>

        <Progress.Root
          value={activeApplicationIndex}
          max={assignedCount}
          className='w-full h-4 bg-gray-200 rounded'
        >
          <Progress.Indicator className='bg-slate-600 h-full rounded' />
        </Progress.Root>
      </div>
    </div>
  );

  function onRatingChange(rating: number, applicationId: number) {
    setRatings((prev) => ({
      ...prev,
      [applicationId]: {
        numeric: rating,
        id: prev[applicationId]?.id ?? uuidv4(),
      },
    }));
  }

  function onSaveAndNext() {
    setIsSubmittingRating(true);
    (async () => {
      const rating = ratings[applications[activeApplicationIndex].id];
      console.log('HERE');
      console.log({ rating });
      const { error } = await supabase.from('Rating').upsert({
        application_id: applications[activeApplicationIndex].id,
        reviewer_id: reviewerId,
        rating,
        id: rating.id,
      });

      if (error) {
        console.error('Error saving rating:', error);
      } else {
        setActiveApplicationIndex((prev) => prev! + 1);
      }

      setIsSubmittingRating(false);
    })();
    // todo: post the ratings state to the backend
  }

  function DoneReading() {
    if (!applicationCycle) throw new Error('No application  cycle');

    return (
      <div className='w-full [height:calc(100vh-72px)] flex flex-col justify-center items-center gap-8'>
        <div className='flex flex-col text-slate-400 items-center gap-4'>
          <RiCheckboxMultipleFill size={96} />
          <h1 className='text-black text-2xl'>You’re all done!</h1>
        </div>

        <AppWizButton to={`/cycle/${applicationCycle.id}`} variant='filled'>
          Return to {applicationCycle?.name ?? 'home'}
        </AppWizButton>
      </div>
    );
  }
}
