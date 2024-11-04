import { appendStyle } from '../../utils/appendStyle';

type ButtonProps = {
  size: 'sm' | 'md';
  variant: 'filled' | 'outlined';
  children?: React.ReactNode;
};

export function AppWizButton({ size, variant, children }: ButtonProps) {
  return (
    <button className={getButtonProps({ size, variant })}>{children}</button>
  );
}

function getButtonProps({ size, variant }: ButtonProps) {
  let base = 'font-bold rounded';

  if (size == 'sm') {
    base += appendStyle('h-8 py-1 px-2 text-sm');
  }
  if (size == 'md') {
    base += appendStyle('h-12 py-2 px-4');
  }

  if (variant === 'filled') {
    base += appendStyle('bg-black text-white');
  }
  if (variant === 'outlined') {
    base += appendStyle('bg-slate-100 text-gray-800 border border-slate-400');
  }

  return base;
}
