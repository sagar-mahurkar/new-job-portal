// 1. Import router components
import { BrowserRouter, Routes } from "react-router-dom";

// 2. Import route groups
import { PublicRoutes } from "./PublicRoutes";
import { ProtectedRoutes } from "./ProtectedRoutes"


// 3. Declare router component
function AppRouter() {

  return (
    // 4. BrowserRouter (only place in entire app)
    <BrowserRouter>
      {/* 5. Routes container */}
      <Routes>
        {PublicRoutes()}
        {ProtectedRoutes()}
      </Routes>
    </BrowserRouter>
  );
}

// 8. Export router
export { AppRouter };
