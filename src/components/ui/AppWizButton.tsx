import { appendStyle } from '../../utils/appendStyle';

type ButtonProps = {
  size?: 'sm' | 'md';
  variant?: 'filled' | 'outlined';
  icon?: React.ReactNode;
  iconSide?: 'left' | 'right';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AppWizButton({
  size = 'md',
  variant = 'filled',
  icon,
  iconSide = 'right',
  disabled = false,
  children,
  className,
  ...restProps
}: ButtonProps) {
  return (
    <button
      className={
        getButtonProps({ size, variant, disabled, children }) +
        appendStyle(className)
      }
      disabled={disabled}
      {...restProps}
    >
      {iconSide === 'left' && icon}
      {children}
      {iconSide === 'right' && icon}
    </button>
  );
}

function getButtonProps({ size, variant, disabled, children }: ButtonProps) {
  let base = 'font-bold rounded flex justify-center items-center gap-2';

  if (size == 'sm') {
    base += appendStyle('h-8 text-sm');

    if (children) {
      base += appendStyle('py-1 px-2');
    } else {
      base += appendStyle('p-1');
    }
  }
  if (size == 'md') {
    base += appendStyle('h-12');

    if (children) {
      base += appendStyle('py-2 px-4');
    } else {
      base += appendStyle('p-1');
    }
  }

  if (variant === 'filled') {
    base += appendStyle('bg-black text-white');
  }
  if (variant === 'outlined') {
    base += appendStyle('bg-slate-100 text-gray-800 border border-slate-300');
  }

  if (disabled) {
    base += appendStyle('opacity-50 cursor-not-allowed');
  }

  return base;
}
