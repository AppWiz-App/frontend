import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function ReviewerEditor() {
  const [reviewers, setReviewers] = useState([]);

  return (
    <div>
      <h3>Reviewers</h3>
      {reviewers.map(({ name, email, id }) => (
        <div key={id} className='flex gap-2'>
          <input
            className='border'
            placeholder='Name'
            value={name}
            onChange={(e) => {
              setReviewerById(id, { id, name: e.target.value, email });
            }}
          />
          <input
            className='border'
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setReviewerById(id, { id, name, email: e.target.value });
            }}
          />
          <button onClick={() => deleteReviewer(id)}>
            Remove
          </button>
        </div>
      ))}
      <button className='bg-black text-white px-4 py-2 rounded' onClick={addReviewer} disabled={reviewers.length >= 10}>
        New Reviewer
      </button>
    </div>
  );

  function addReviewer() {
    setReviewers([...reviewers, { name: '', email: '', id: uuidv4() }]);
  }

  function deleteReviewer(id) {
    setReviewers(reviewers.filter((reviewer) => reviewer.id !== id));
  }

  function setReviewerById(id, newReviewer) {
    setReviewers(
      reviewers.map((reviewer) =>
        reviewer.id === id ? newReviewer : reviewer
      )
    );
  }
}
