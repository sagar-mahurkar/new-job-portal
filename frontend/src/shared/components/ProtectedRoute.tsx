import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ROUTES } from "@/routes/routes";

const ProtectedRoute = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) { 
    return null
  };

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.URLS.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;