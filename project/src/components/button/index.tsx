import './button.css';

type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type'
> & {
  label: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: 'primary' | 'secondary';
};

const Button: React.FC<ButtonProps> = ({
  label,
  disabled = false,
  type = 'button',
  className,
  variant = 'primary',
  ...buttonProps
}) => {
  const cssClasses = ['button', `button-${variant}`];
  if (className) {
    cssClasses.push(className);
  }

  return (
    <button
      className={cssClasses.join(' ')}
      type={type}
      disabled={disabled}
      {...buttonProps}
    >
      {label && <span>{label}</span>}
    </button>
  );
};

export default Button;
