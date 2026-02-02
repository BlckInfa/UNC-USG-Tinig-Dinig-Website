import './Button.css';

/**
 * Reusable Button Component
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'outline' | 'danger'} props.variant
 * @param {'sm' | 'md' | 'lg'} props.size
 * @param {boolean} props.disabled
 * @param {boolean} props.loading
 * @param {string} props.className
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
