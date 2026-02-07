import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

// Feature Pages
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import FinanceDashboard from "./features/finance/pages/FinanceDashboard";
import TinigDashboard from "./features/tinig/pages/TinigDashboard";
import OrgChart from "./features/org/pages/OrgChart";
import {
    IssuanceListPage,
    AdminIssuanceList,
    AdminReports,
} from "./features/issuances";

// Hooks
import { useAuth } from "./hooks/useAuth";

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/issuances" element={<IssuanceListPage />} />
            </Route>

            {/* Protected Routes */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/tinig" element={<TinigDashboard />} />
                <Route path="/organization" element={<OrgChart />} />
                <Route
                    path="/admin/issuances"
                    element={<AdminIssuanceList />}
                />
                <Route path="/admin/reports" element={<AdminReports />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
