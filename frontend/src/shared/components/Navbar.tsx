import { Link } from "react-router-dom";
import { ROUTES } from "../../routes/routes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { getHomeRoute } from "@/modules/auth/auth.routes";

const Navbar = () => {
  const { user, logout } = useAuth();
  const handleLogout = () => {
    logout();
  }

  let dashboardRoute: string = "/";
  if (user) {
    dashboardRoute = getHomeRoute(user.role);
  }
  return(
    <nav className="navbar navbar-expand-lg bg-body-tertiary no-print">
      <div className="container-fluid">
        <Link className="navbar-brand" to={ROUTES.HOME}>JP</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={ROUTES.AUTH.URLS.LOGIN}>Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={ROUTES.AUTH.URLS.REGISTER}>Register</Link>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="btn btn-link nav-link" to={dashboardRoute}>Dashboard</Link>
                </li>
                {user.role === "RECRUITER" && (
                  <>
                    <li className="nav-item">
                      <Link className="btn btn-link nav-link" to={ROUTES.RECRUITER.URLS.JOBS}>My Jobs</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="btn btn-link nav-link" to={ROUTES.RECRUITER.URLS.PROFILE}>Profile</Link>
                    </li>
                  </>
                )}
                {user.role === "CANDIDATE" && (
                  <>
                    <li className="nav-item">
                      <Link className="btn btn-link nav-link" to={ROUTES.CANDIDATE.URLS.PROFILE}>Profile</Link>
                    </li>
                  </>
                )}
                <li className="nav-item">
                  <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;