import { useParams } from 'react-router-dom';

export function Cycle() {
  const { id } = useParams();

  return (
    <div>
      <h1>Cycle id {id}</h1>
    </div>
  );
}
