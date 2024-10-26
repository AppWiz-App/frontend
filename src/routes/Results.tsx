import { useLocation } from 'react-router-dom';

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
  console.log(ac);

  console.log('ASSIGNMENTS HERE', assignments);

  return (
    <div>
      {assignments.map((assignment, index) => (
        <>
        <h3>{locationState.reviewers[index].name}</h3>
        {assignment.map(range => (<p>
          {range[0]}{' - '}{range[1]}
        </p>))}
        
        <br />
        </>
      ))}
    </div>
  );
}
