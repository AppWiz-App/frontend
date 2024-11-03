import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { session } = useAuth();

  console.log(session);

  return (
    <div>
      <p>session:</p>

      <br />

      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
