import './Spinner.css';

/**
 * Loading Spinner Component
 */
const Spinner = ({ size = 'md', className = '' }) => {
  return (
    <div className={`spinner spinner-${size} ${className}`} />
  );
};

export default Spinner;
