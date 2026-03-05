import { Route } from "react-router-dom";
import { CandidateDashboardPage } from "@/features/candidate/pages/CandidateDashboardPage";
import { ProtectedRoute } from "./ProtectedRoute";

function ProtectedRoutes() {
  return (
    <>
      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute>
            <CandidateDashboardPage />
          </ProtectedRoute>
        }
      />
    </>
  )
}

export { ProtectedRoutes }
