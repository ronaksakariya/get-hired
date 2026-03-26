import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/context/useAuth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!role && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <Navigate to={role === "candidate" ? "/jobs" : "/post-job"} replace />
    );
  }

  return children;
};

export default ProtectedRoute;
