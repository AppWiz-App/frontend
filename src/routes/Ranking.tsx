// import { useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { supabase } from '../utils/supabase';
import { useAuth } from '../hooks/useAuth';
import { useContext, useEffect, useState } from 'react';
import { Database } from '../../database.types';
import { CycleContext } from '../utils/CycleProvider';

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
  const { applicationCycle, reviewers, ratings, applications } =
    useContext(CycleContext);
  console.log(
    'HEREEEEE',
    applicationCycle,
    reviewers,
    { ratings },
    applications
  );
  return <div></div>;
}
