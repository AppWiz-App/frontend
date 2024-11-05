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
      className={getButtonProps() + appendStyle(className)}
      disabled={disabled}
      {...restProps}
    >
      {iconSide === 'left' && icon}
      {children}
      {iconSide === 'right' && icon}
    </button>
  );

  function getButtonProps() {
    let className = 'font-bold rounded flex justify-center items-center gap-2';

    if (size == 'sm') {
      className += appendStyle('h-8 text-sm');

      if (children) {
        className += appendStyle('py-1 px-2');
      } else {
        className += appendStyle('p-1');
      }
    }
    if (size == 'md') {
      className += appendStyle('h-12');

      if (children) {
        className += appendStyle('py-2 px-4');
      } else {
        className += appendStyle('p-1');
      }
    }

    if (variant === 'filled') {
      className += appendStyle('bg-black text-white');
    }
    if (variant === 'outlined') {
      className += appendStyle(
        'bg-slate-100 text-gray-800 border border-slate-300'
      );
    }

    if (disabled) {
      className += appendStyle('opacity-50 cursor-not-allowed');
    }

    return className;
  }
}
