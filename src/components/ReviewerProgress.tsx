import { useContext } from 'react';
import { CycleContext } from '../utils/CycleProvider';
import { AppWizProgress } from './ui/AppWizProgress';
import { Loading } from './Loading';

export function ReviewerProgress() {
  const { reviewers, ratings, assignments } = useContext(CycleContext);

  if (!reviewers || !ratings || !assignments) {
    return <Loading />;
  }

  const reviewerProgress = reviewers.reduce((acc, reviewer) => {
    const totalAssignments = assignments.filter(
      (assignment) => assignment.reviewer_id === reviewer.id
    ).length;
    console.log('LENGTH HERE', totalAssignments);

    console.log({ assignments });
    const completedAssignments = ratings.filter(
      (rating) => rating.reviewer_id === reviewer.id
    ).length;

    acc[reviewer.id] = {
      name: reviewer.name,
      totalAssignments,
      completedAssignments,
    };

    return acc;
  }, {});

  const sortedReviewerProgress = Object.values(reviewerProgress).sort(
    (a, b) => {
      if (
        a.completedAssignments / a.totalAssignments >
        b.completedAssignments / b.totalAssignments
      )
        return -1;
    }
  );

  console.log({ reviewerProgress });
  console.log({ sortedReviewerProgress });

  return (
    <div className='flex flex-col gap-1'>
      {sortedReviewerProgress.map((reviewer) => (
        <div className='flex text-xl'>
          <p className='w-32 truncate text-ellipsis'>{reviewer.name}</p>
          <AppWizProgress
            value={reviewer.completedAssignments}
            max={reviewer.totalAssignments}
          />
          <p className='min-w-16 text-right'>
            {reviewer.completedAssignments}/{reviewer.totalAssignments}
          </p>
        </div>
      ))}
    </div>
  );
}
