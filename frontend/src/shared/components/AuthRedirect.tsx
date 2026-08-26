import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getHomeRoute } from "@/modules/auth/auth.routes";

const AuthRedirect = () => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
      return null; // or a spinner
  }

  if (isAuthenticated && user) {
      return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default AuthRedirect;