import { Link } from "react-router-dom";
import { ROUTES } from "../routes/routes";

const ErrorPage = () => {
  return (
    <>
      <h1>Error Page 404</h1>
      <Link to={ROUTES.HOME}> Go to Home</Link>
    </>
  )
}

export default ErrorPage;