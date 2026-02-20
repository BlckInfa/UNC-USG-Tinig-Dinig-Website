import { Routes, Route } from "react-router-dom";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Feature Pages
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import FinanceDashboard from "./features/finance/pages/FinanceDashboard";
import TinigDashboard from "./features/tinig/pages/TinigDashboard";
import TinigSurveyForm from "./features/tinig/pages/TinigSurveyForm";
import OrgChart from "./features/org/pages/OrgChart";
import { IssuanceListPage, AdminIssuanceList } from "./features/issuances";

// Route Guards
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/issuances" element={<IssuanceListPage />} />
            </Route>

            {/* Dashboard Routes — open to all users */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/finance" element={<FinanceDashboard />} />
                <Route path="/tinig" element={<TinigDashboard />} />
                <Route path="/tinig/survey" element={<TinigSurveyForm />} />
                <Route path="/organization" element={<OrgChart />} />

                {/* Admin-only — requires login + ADMIN or SUPER_ADMIN role */}
                <Route
                    element={
                        <ProtectedRoute roles={["ADMIN", "SUPER_ADMIN"]} />
                    }>
                    <Route
                        path="/admin/issuances"
                        element={<AdminIssuanceList />}
                    />
                </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
