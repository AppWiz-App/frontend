import { useLocation } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const STATE_STUB = {
  "reviewers": [
    {
        "name": "Poulami",
        "email": "",
        "id": "6b0c2f39-c136-4a20-817e-70b5b7bdc142"
    },
    {
        "name": "Rishi",
        "email": "",
        "id": "38e79fb6-9e40-489d-a4e8-b51b352b3648"
    },
    {
        "name": "Brian",
        "email": "",
        "id": "4542e1f8-dabe-48f2-b8fa-8c41caad5f70"
    }
],
  "customizations": {
      "name": "",
      "reviewersPerApp": 2
  },
  "_applicantCount": 932
}

export function Results() {
  const location = useLocation();
  console.log(location);
  const locationState = location.state ?? STATE_STUB

  const reviewers: [] = locationState.reviewers;
  const reviewerCount = locationState.reviewers.length;
  const applicantCount = locationState._applicantCount;
  const reviewersPerApp = locationState.customizations.reviewersPerApp;

  console.log({ reviewerCount });
  console.log({ applicantCount });
  console.log({ reviewersPerApp });

  let assignments = [];

  let ac = 0;

  const applicationsPerReviewer = Math.ceil(
    (applicantCount * reviewersPerApp) / reviewerCount
  );

  for (let i = 0; i < reviewerCount; i++) {
    const myAssignments = [];

    const maxApp = ac + applicationsPerReviewer - 1;
    myAssignments.push([ac, Math.min(applicantCount - 1, maxApp)]);

    if (maxApp > applicantCount - 1 && i !== reviewerCount - 1) {
      myAssignments.push([0, maxApp - applicantCount]);
      ac = maxApp - applicantCount + 1;
    }
    else if (maxApp === applicantCount - 1) {
      ac = 0;
    }
    else {
      ac += applicationsPerReviewer;
    }
    console.log(assignments);
    
    assignments.push(myAssignments);
  }
  let assignmentMap = [];
  for(let i = 0; i < reviewerCount; i++){
    let newMapping = [];
    newMapping.push(reviewers[i].name);
    newMapping.push(assignments[i]); 
    assignmentMap.push(newMapping);
  }
  
  return (
    <div>
      <h3 className='page-header'>Assignments</h3>
      <TableContainer>
        <Table sx={{width: '50%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Reviewers</TableCell>
              <TableCell align="left">Rows</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignmentMap.map((row) => (
              <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                {row[0]}
                </TableCell>
                <TableCell align="left">
                  {row[1][0][0]}-{row[1][0][1]}
                  {row[1].length > 1 && (
                    <span> , {row[1][1][0]}-{row[1][1][1]}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
