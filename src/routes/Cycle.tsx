import { Navigate, useParams } from 'react-router-dom';
import { Results } from './Results';
import { AppWizButton } from '../components/ui/AppWizButton';
import '../index.css';
import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

type Reviewer = {
  id: string;
  name: string;
  email: string;
  application_cycle_id: string;
};

export function Cycle() {
  const { id } = useParams();

  const [reviewers, setReviewers] = useState<Reviewer[] | undefined>();

  useEffect(() => {
    if (!id) return;

    const fetchReviewers = async () => {
      const { data, error } = await supabase
        .from('Reviewer')
        .select('*')
        .eq('application_cycle_id', id);

      if (error) {
        console.error('Error fetching reviewers:', error);
      } else {
        setReviewers(data);
      }
    };

    fetchReviewers();
  }, [id]);

  if (!id) {
    return <Navigate to='/home' replace={true} />;
  }

  return (
    <div className='p-12'>
      <AppWizButton to='/home'>Read applications</AppWizButton>

      <div>
        <h3 className='page-header'>Reviewers</h3>
        <ul className='pl-8'>
          {reviewers?.map((reviewer) => {
            return <li key={reviewer.id}>{reviewer.name}</li>;
          })}
        </ul>
      </div>

      <Results id={id} />
    </div>
  );
}
