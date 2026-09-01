import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
    const token = localStorage.getItem("token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    let user = {};

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch (error) {
        console.error("Failed to read logged-in user:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/" replace />;
    }

    if (
        Array.isArray(allowedRoles) &&
        allowedRoles.length > 0 &&
        !allowedRoles.includes(user.role)
    ) {
        if (user.role === "company") {
            return (
                <Navigate
                    to="/company-dashboard"
                    replace
                    state={{ from: location.pathname }}
                />
            );
        }

        if (user.role === "university") {
            return (
                <Navigate
                    to="/university-dashboard"
                    replace
                    state={{ from: location.pathname }}
                />
            );
        }

        if (user.role === "student") {
            return (
                <Navigate
                    to="/student-dashboard"
                    replace
                    state={{ from: location.pathname }}
                />
            );
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;