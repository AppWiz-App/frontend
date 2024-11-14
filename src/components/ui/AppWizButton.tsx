import { useNavigate } from 'react-router-dom';
import { appendStyle } from '../../utils/appendStyle';

type ButtonProps = {
  size?: 's' | 'm' | 'l';
  variant?: 'filled' | 'outlined';
  icon?: React.ReactNode;
  iconSide?: 'left' | 'right';
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
} & (
  | { to: string; onClick?: never }
  | { to?: never; onClick: React.MouseEventHandler<HTMLButtonElement> }
) &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

export function AppWizButton({
  size = 'm',
  variant = 'filled',
  icon,
  iconSide = 'right',
  disabled = false,
  to,
  onClick,
  children,
  className,
  ...restProps
}: ButtonProps) {
  const navigate = useNavigate();

  return (
    <button {...getButtonProps()} disabled={disabled} {...restProps}>
      {iconSide === 'left' && icon}
      {children}
      {iconSide === 'right' && icon}
    </button>
  );

  function getButtonProps() {
    let style = 'font-bold rounded flex justify-center items-center gap-2';

    if (size == 's') {
      style += appendStyle('h-8 text-sm');

      if (children) {
        style += appendStyle('py-1 px-2');
      } else {
        style += appendStyle('p-1');
      }
    }
    if (size == 'm') {
      style += appendStyle('h-12');

      if (children) {
        style += appendStyle('py-2 px-4');
      } else {
        style += appendStyle('p-1');
      }
    }
    if (size == 'l') {
      style += appendStyle('h-20 text-2xl');

      if (children) {
        style += appendStyle('py-6 px-12');
      } else {
        style += appendStyle('p-2');
      }
    }

    if (variant === 'filled') {
      style += appendStyle('bg-black text-white');
    }
    if (variant === 'outlined') {
      style += appendStyle(
        'bg-slate-100 text-gray-800 border border-slate-300'
      );
    }

    if (disabled) {
      style += appendStyle('opacity-50 cursor-not-allowed');
    }

    return {
      onClick: onClick ? onClick : () => navigate(to),
      className: style + appendStyle(className),
    };
  }
}
