import { Outlet, Link } from 'react-router-dom';
import './PublicLayout.css';

/**
 * Public Layout - For unauthenticated pages
 */
const PublicLayout = () => {
  return (
    <div className="public-layout">
      <header className="public-header">
        <div className="container">
          <Link to="/" className="logo">
            <span className="logo-text">USG</span>
            <span className="logo-subtitle">Tinig Dinig</span>
          </Link>
          <nav className="public-nav">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </div>
      </header>
      
      <main className="public-main">
        <Outlet />
      </main>
      
      <footer className="public-footer">
        <div className="container">
          <p>&copy; 2024 UNC University Student Government. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
