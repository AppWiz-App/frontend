interface AppWizProgressProps {
  value: number;
  max: number;
}

export function AppWizProgress({ value, max }: AppWizProgressProps) {
  const width = (value / max) * 100;
  console.log(width);

  return (
    <div className='w-full h-6 bg-white border border-slate-300 rounded-md'>
      <div
        style={{
          height: '100%',
          width: `${width}%`,
          background: '#4372AF',
          borderRadius: '6px',
        }}
      ></div>
    </div>
  );
}
