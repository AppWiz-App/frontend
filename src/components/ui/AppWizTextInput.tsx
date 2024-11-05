import { appendStyle } from '../../utils/appendStyle';

type AppWizTextInputProps = {
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AppWizTextInput({
  value = '',
  placeholder = '',
  onChange,
  disabled = false,
  className,
  ...restProps
}: AppWizTextInputProps) {
  return (
    <input
      className={getInputProps() + appendStyle(className)}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e)}
      disabled={disabled}
      {...restProps}
    />
  );

  function getInputProps() {
    let className = 'border px-2 py-1 rounded bg-slate-50 w-full';

    if (disabled) {
      className += appendStyle('opacity-50 cursor-not-allowed');
    }

    return className;
  }
}
