// @ts-nocheck
// import { useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useContext } from 'react';

import { CycleContext } from '../utils/CycleProvider';
import { Loading } from './Loading';

// export const Ranking = ({ id }: { id: string }) => {
//   const [reviewers, setReviewers] = useState(null);
//   const [ratings, setRatings] = useState(null);

//   console.log("cycle id: ", id);

//   // Query for all reviewers
//   useEffect(() => {
//     const fetchReviewers = async () => {
//       const { data, error } = await supabase
//       .from('Reviewer')
//       .select('*')
//       .eq('application_cycle_id', id);
//       if (error) {
//         console.log(error);
//       }
//       else {
//         setReviewers(data);
//       }
//     }
//   });

//   // let { data: reviewers, error } = await supabase
//   //   .from('Reviewer')
//   //   .select('*')
//   //   .eq('application_cycle_id', id);

//   // if (error) {
//   //   console.error('Error fetching reviewers:', error);
//   //   return;
//   // }

//   console.log("reviewers: " , reviewers);

//   // Initialize a map for reviewer id -> reviewer
//   const reviewerIdToName = new Map<number, string>();
//   for(let i = 0; i <= reviewers!.length; i++){
//     reviewerIdToName.set(reviewers![i].id, reviewers![i].name);
//   }

//   // Initialize a map from reviewer -> number of applications read
//   const reviewerReadCount = new Map<string, number>();

//   // Query ratings table and update map
//   useEffect(() => {
//     const fetchRatings = async () => {
//       const { data, error } = await supabase
//       .from('Rating')
//       .select('*')
//       .eq('application_cycle_id', id);
//       if(error){
//         console.log(error);
//       }
//       else {
//         setRatings(data);
//       }
//     }
//   })

//   console.log("ratings: ", ratings);

//   if(!ratings){
//     return;
//   }
//   for(let i = 0; i <= ratings.length; i++){
//     const readerId = ratings.reviewer_id;
//     reviewerReadCount.set(reviewerIdToName.get(readerId)!, reviewerReadCount.get(reviewerIdToName.get(readerId)!)! + 1);
//   }

//   // Render results
//   console.log("reviewerReadCount: ", reviewerReadCount);
//   return (
//     <div></div>
//   );
// }

export function Ranking() {
  const { ratings, applications } = useContext(CycleContext);

  const applicantScores = new Map<number, { total: number; count: number }>();

  if (!ratings) return <Loading />;

  ratings.forEach(
    (rating: { application_id: number; rating: { numeric: number } }) => {
      if (!applicantScores.has(rating.application_id)) {
        applicantScores.set(rating.application_id, { total: 0, count: 0 });
      }
      const score = applicantScores.get(rating.application_id)!;
      score.total += rating.rating.numeric;
      score.count += 1;
    }
  );
  applications?.forEach((application) => {
    if (!applicantScores.has(application.id)) {
      applicantScores.set(application.id, { total: null, count: 0 });
    }
  });

  console.log(applicantScores);

  const applicantAverages = Array.from(applicantScores.entries()).map(
    ([applicant_id, { total, count }]) => ({
      applicant_id,
      average: total ? total / count : null,
      count,
    })
  );

  applicantAverages.sort((a, b) => b.average - a.average);

  return (
    <div className='[font-size:24px_!important]'>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant</TableCell>
              <TableCell>Average rating</TableCell>
              <TableCell>Number of ratings</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applicantAverages.map(({ applicant_id, average, count }) => (
              <TableRow key={applicant_id}>
                <TableCell>
                  {applications?.find(
                    (application) => application.id === applicant_id
                  )?.app_data?.Name ?? applicant_id}
                </TableCell>
                <TableCell>{average?.toFixed(1) ?? 'No ratings'}</TableCell>
                <TableCell>{count ? count : 'No ratings'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
