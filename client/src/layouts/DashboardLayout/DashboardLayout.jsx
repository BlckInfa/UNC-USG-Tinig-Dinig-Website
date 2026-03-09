import { Outlet, Link, useNavigate } from "react-router-dom";
import {
    LuLayoutDashboard,
    LuMessageSquare,
    LuWallet,
    LuUsers,
    LuFileStack,
    LuMoon,
    LuSun,
    LuLogOut,
    LuLogIn,
} from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import "./DashboardLayout.css";

/**
 * Dashboard Layout - For authenticated users
 */
const DashboardLayout = () => {
    const { user, logout, isAuthenticated } = useAuth();
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
                        <LuLayoutDashboard size={18} className="nav-icon" />
                        Dashboard
                    </Link>
                    <Link to="/tinig" className="nav-link">
                        <LuMessageSquare size={18} className="nav-icon" />
                        Tinig Dinig
                    </Link>
                    <Link to="/finance" className="nav-link">
                        <LuWallet size={18} className="nav-icon" />
                        Finance
                    </Link>
                    <Link to="/organization" className="nav-link">
                        <LuUsers size={18} className="nav-icon" />
                        Organization
                    </Link>
                    <Link to="/admin/issuances" className="nav-link">
                        <LuFileStack size={18} className="nav-icon" />
                        Issuances & Reports
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
                                <LuMoon size={18} />
                            :   <LuSun size={18} />}
                        </button>
                        <div className="user-menu">
                            {isAuthenticated ?
                                <>
                                    <span className="user-name">
                                        {user?.name || "User"}
                                    </span>
                                    <button
                                        className="logout-btn"
                                        onClick={handleLogout}>
                                        <LuLogOut size={16} />
                                        Logout
                                    </button>
                                </>
                            :   <Link to="/login" className="logout-btn">
                                    <LuLogIn size={16} />
                                    Login
                                </Link>
                            }
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
