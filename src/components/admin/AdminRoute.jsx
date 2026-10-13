
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AdminRoute() {
    const { isAuthenticated, user } = useSelector(
        (state) => state.auth
    );

    const location = useLocation();

    // If the user is not logged in, redirect to Login.
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // If the user is not an admin, redirect to the store.
    if (user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    // Only admins can access the nested admin pages.
    return <Outlet />;
}
