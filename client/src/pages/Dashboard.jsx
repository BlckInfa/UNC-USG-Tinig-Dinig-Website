import {
    LuMail,
    LuCheckCircle,
    LuClock,
    LuUsers,
    LuFileSignature,
    LuBarChart3,
    LuWallet,
} from "react-icons/lu";
import { Card } from "../components";
import "./Dashboard.css";

/**
 * Dashboard Page
 */
const Dashboard = () => {
    const stats = [
        { label: "Active Tickets", value: 24, icon: LuMail },
        { label: "Resolved", value: 156, icon: LuCheckCircle },
        { label: "Pending Review", value: 8, icon: LuClock },
        { label: "Total Users", value: 1250, icon: LuUsers },
    ];

    return (
        <div className="dashboard-page">
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <Card key={index} className="stat-card">
                        <div className="stat-icon">
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="dashboard-grid">
                <Card title="Recent Activity" className="activity-card">
                    <ul className="activity-list">
                        <li className="activity-item">
                            <span className="activity-dot"></span>
                            <div className="activity-content">
                                <p>New ticket submitted by Juan Dela Cruz</p>
                                <span className="activity-time">
                                    2 hours ago
                                </span>
                            </div>
                        </li>
                        <li className="activity-item">
                            <span className="activity-dot success"></span>
                            <div className="activity-content">
                                <p>Ticket #145 marked as resolved</p>
                                <span className="activity-time">
                                    5 hours ago
                                </span>
                            </div>
                        </li>
                        <li className="activity-item">
                            <span className="activity-dot"></span>
                            <div className="activity-content">
                                <p>New comment on Ticket #142</p>
                                <span className="activity-time">1 day ago</span>
                            </div>
                        </li>
                    </ul>
                </Card>

                <Card title="Quick Actions" className="actions-card">
                    <div className="quick-actions">
                        <button className="quick-action-btn">
                            <FilePen size={18} />
                            New Ticket
                        </button>
                        <button className="quick-action-btn">
                            <BarChart3 size={18} />
                            View Reports
                        </button>
                        <button className="quick-action-btn">
                            <Wallet size={18} />
                            Finance
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
