import { Link } from 'react-router-dom';
import { Button } from '../components';
import './NotFound.css';

/**
 * 404 Not Found Page
 */
const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary">Go Back Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
