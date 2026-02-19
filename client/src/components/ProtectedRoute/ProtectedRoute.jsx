import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../../components";

/**
 * ProtectedRoute — authentication & role-based route guard.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>              — auth only
 *   <Route element={<ProtectedRoute roles={[...]} />}> — auth + role check
 *
 * Behaviour:
 *   - While auth is loading → show a full-page spinner
 *   - Not authenticated    → redirect to /login (preserves intended URL)
 *   - Authenticated but wrong role → redirect to /dashboard
 *   - Passes                      → render child <Outlet />
 */
const ProtectedRoute = ({ roles }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const location = useLocation();

    // Wait for auth state to initialise
    if (isLoading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                }}>
                <Spinner />
            </div>
        );
    }

    // Not logged in → send to login, remember where they wanted to go
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Role check (if roles prop is supplied)
    if (roles && roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
