import { useState } from 'react';

export function Customization({ formState, setFormState }) {
  const [cycleName, setCycleName] = useState('');

  const handleCycleChange = (event: any) => {
    setCycleName(event.target.value);
  };

  console.log(formState._applicantCount);
  console.log(formState.reviewers);
  console.log(formState.customizations.reviewersPerApp);

  return (
    <div>
      <h3 className='page-header'>Customization</h3>
      <h3 className='page-subheader'>Cycle Name</h3>
      <input
        className='input-box'
        placeholder='Enter cycle name'
        value={cycleName}
        onChange={handleCycleChange}
      ></input>
      <h3 className='page-subheader'>Applications</h3>
      <p className='applications-text'>{formState._applicantCount}</p>
      <h3 className='page-subheader'>Reviewers Per Application</h3>
      <div className='reviewers-container'>
        <button className='minus-button' onClick={decrementReviewersPerApp}>
          -
        </button>
        <p className='reviewers-text'>{formState.customizations.reviewersPerApp}</p>
        <button className='plus-button' onClick={incrementReviewersPerApp}>
          +
        </button>
      </div>
      <p className='applications-per-reader-text'>
        Applications per reader:{' '}
        {Math.ceil((formState._applicantCount *
          formState.customizations.reviewersPerApp) /
          formState.reviewers.length)}
      </p>
    </div>
  );

  function incrementReviewersPerApp() {
    if (formState.customizations.reviewersPerApp < formState.reviewers.length) {
      setFormState((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          reviewersPerApp: prev.customizations.reviewersPerApp + 1,
        },
      }));
    }
  }

  function decrementReviewersPerApp() {
    if (formState.customizations.reviewersPerApp > 0) {
      setFormState((prev) => ({
        ...prev,
        customizations: {
          ...prev.customizations,
          reviewersPerApp: prev.customizations.reviewersPerApp - 1,
        },
      }));
    }
  }
}
