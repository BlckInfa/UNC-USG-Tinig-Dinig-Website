import './Card.css';

/**
 * Reusable Card Component
 */
const Card = ({
  children,
  title,
  subtitle,
  className = '',
  padding = true,
  hoverable = false,
  ...props
}) => {
  const classes = [
    'card',
    padding && 'card-padded',
    hoverable && 'card-hoverable',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-body">
        {children}
      </div>
    </div>
  );
};

export default Card;
