import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { session } = useAuth();

  console.log(session);

  return (
    <div>
      <h1>Home</h1>
      <p>Home page content</p>
      <p>{JSON.stringify(session)}</p>
    </div>
  );
}
