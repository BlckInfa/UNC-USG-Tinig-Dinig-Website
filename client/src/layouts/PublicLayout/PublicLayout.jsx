import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './PublicLayout.css';
import USG_LOGO from '../../assets/USG LOGO NO BG.png';

/**
 * Public Layout - For unauthenticated pages
 * Transparent header on home page, solid on others
 */
const PublicLayout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const headerClass = [
    'public-header',
    isHome && !scrolled ? 'header-transparent' : '',
    scrolled ? 'header-scrolled' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="public-layout">
      <header className={headerClass}>
        <div className="container">
          <Link to="/" className="logo">
            <img src={USG_LOGO} alt="USG Logo" className="logo-img" />
            <div className="logo-text-group">
              <span className="logo-text">USG</span>
              <span className="logo-subtitle">Tinig Dinig</span>
            </div>
          </Link>

          <button
            className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>

          <nav className={`public-nav ${menuOpen ? 'nav-open' : ''}`}>
            <Link to="/">Home</Link>
            <a href="#tinig-dinig">Tinig Dinig</a>
            <Link to="/issuances">Issuances</Link>
            <Link to="/login" className="nav-btn nav-btn-outline">Sign In</Link>
            <Link to="/register" className="nav-btn nav-btn-primary">Register</Link>
          </nav>
        </div>
      </header>
      
      <main className={`public-main ${isHome ? 'main-home' : ''}`}>
        <Outlet />
      </main>

      {/* Footer is rendered inside Home.jsx for the landing page */}
      {!isHome && (
        <footer className="public-footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} UNC University Student Government. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
