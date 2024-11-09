import { Navigate, useParams } from 'react-router-dom';
import { Results } from './Results';

export function Cycle() {
  const { id } = useParams();

  if (!id) {
    return <Navigate to='/home' replace={true} />;
  }

  return (
    <div className='p-12'>
      <Results id={id} />
    </div>
  );
}
