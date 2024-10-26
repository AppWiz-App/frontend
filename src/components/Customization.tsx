import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function Customization({applicantCount}) {
  const [cycleName, setCycleName] = useState("");
  const [reviewersPerApp, setReviewersPerApp] = useState(0);

  const handleCycleChange = (event: any) => {
    setCycleName(event.target.value);
  };

  return (
    <div>
      <h3 className="page-header">Customization</h3>
      <h3 className="page-subheader">Cycle Name</h3>
      <input 
        className="input-box" 
        placeholder='Enter cycle name' 
        value={cycleName} 
        onChange={handleCycleChange}>
      </input>
      <h3 className="page-subheader">Applications</h3>
      <p className='applications-text'>{applicantCount}</p>
      <h3 className="page-subheader">Reviewers Per Application</h3>
      <div className="reviewers-container">
        <button className='minus-button' onClick={decrementReviewersPerApp}>-</button>
        <p className='reviewers-text'>{reviewersPerApp}</p>
        <button className='plus-button' onClick={incrementReviewersPerApp}>+</button>
      </div>
      <p className="applications-per-reader-text">Applications per reader: 42</p>
    </div>
  );

  function incrementReviewersPerApp() {
    setReviewersPerApp(reviewersPerApp + 1);
  }

  function decrementReviewersPerApp() {
    if(reviewersPerApp - 1 >= 0){
      setReviewersPerApp(reviewersPerApp - 1);
    }
  }
}

