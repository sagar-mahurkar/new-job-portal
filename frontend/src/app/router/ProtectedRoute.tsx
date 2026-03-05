import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Navigate } from "react-router-dom"

type ProtectedRouteProps = {
  children: ReactNode
}

function ProtectedRoute({children}: ProtectedRouteProps) {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login/password" replace />;
  }
  return children;
}

export { ProtectedRoute }
