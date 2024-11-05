import { appendStyle } from '../../utils/appendStyle';

type ButtonProps = {
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outlined';
  icon?: React.ReactNode;
  iconSide?: 'left' | 'right';
  children?: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AppWizButton({
  size = 'md',
  variant = 'filled',
  icon,
  iconSide = 'right',
  children,
  ...buttonProps
}: ButtonProps) {
  return (
    <button className={getButtonProps({ size, variant })} {...buttonProps}>
      {iconSide === 'left' && icon}
      {children}
      {iconSide === 'right' && icon}
    </button>
  );
}

function getButtonProps({ size, variant }: ButtonProps) {
  let base = 'font-bold rounded flex justify-center items-center gap-2';

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
    base += appendStyle('bg-slate-100 text-gray-800 border border-slate-300');
  }

  return base;
}
