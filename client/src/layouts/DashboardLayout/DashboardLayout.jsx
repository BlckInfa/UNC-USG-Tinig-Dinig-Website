import { Outlet, Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    MessageSquare,
    Wallet,
    Users,
    ClipboardList,
    FileStack,
    TrendingUp,
    Moon,
    Sun,
    LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import "./DashboardLayout.css";

/**
 * Dashboard Layout - For authenticated users
 */
const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
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
                        <LayoutDashboard size={18} className="nav-icon" />
                        Dashboard
                    </Link>
                    <Link to="/tinig" className="nav-link">
                        <MessageSquare size={18} className="nav-icon" />
                        Tinig Dinig
                    </Link>
                    <Link to="/finance" className="nav-link">
                        <Wallet size={18} className="nav-icon" />
                        Finance
                    </Link>
                    <Link to="/organization" className="nav-link">
                        <Users size={18} className="nav-icon" />
                        Organization
                    </Link>
                    <Link to="/reports" className="nav-link">
                        <ClipboardList size={18} className="nav-icon" />
                        Reports
                    </Link>
                    <Link to="/admin/issuances" className="nav-link">
                        <FileStack size={18} className="nav-icon" />
                        Issuances Admin
                    </Link>
                    <Link to="/admin/reports" className="nav-link">
                        <TrendingUp size={18} className="nav-icon" />
                        Reports Admin
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
                            {theme === "light" ?
                                <Moon size={18} />
                            :   <Sun size={18} />}
                        </button>
                        <div className="user-menu">
                            <span className="user-name">
                                {user?.name || "User"}
                            </span>
                            <button
                                className="logout-btn"
                                onClick={handleLogout}>
                                <LogOut size={16} />
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
