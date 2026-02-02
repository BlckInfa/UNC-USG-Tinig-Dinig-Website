import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import './DashboardLayout.css';

/**
 * Dashboard Layout - For authenticated users
 */
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard" className="sidebar-logo">
            <span className="logo-text">USG</span>
            <span className="logo-subtitle">Tinig Dinig</span>
          </Link>
        </div>
        
        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-link">
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/tinig" className="nav-link">
            <span className="nav-icon">💬</span>
            Tinig Dinig
          </Link>
          <Link to="/finance" className="nav-link">
            <span className="nav-icon">💰</span>
            Finance
          </Link>
          <Link to="/organization" className="nav-link">
            <span className="nav-icon">👥</span>
            Organization
          </Link>
          <Link to="/reports" className="nav-link">
            <span className="nav-icon">📋</span>
            Reports
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <div className="user-menu">
              <span className="user-name">{user?.name || 'User'}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
