import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import type { UserRole } from "../types/user";
import { getHomeRoute } from "@/modules/auth/auth.routes";

const RoleGuard = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const { user, loading } = useAuth();
  if (loading){
    return null;
  };
  
  if (!user) {
      return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={getHomeRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default RoleGuard;