import { AppWizButton } from '../components/ui/AppWizButton';

export function Home() {
  return (
    <div>
      <h1>Application cycles</h1>

      <AppWizButton variant='filled' size='md'>
        New application cycle
      </AppWizButton>
    </div>
  );
}
