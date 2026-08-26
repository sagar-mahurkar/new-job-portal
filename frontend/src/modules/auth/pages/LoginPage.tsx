import { useEffect } from "react";
import { z } from "zod";
import { authApi } from "../auth.api";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useAlert } from "@/context/AlertContext";
import { getHomeRoute } from "../auth.routes";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { loginPasswordSchema } from "../schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

type LoginInputs = z.infer<typeof loginPasswordSchema>;

const LoginPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { state } = useLocation();

  const { login, loading, isAuthenticated, user } = useAuth();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInputs>({
    resolver: zodResolver(loginPasswordSchema)
  });

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const { token, user, message } = await authApi.loginWithPassword(data);
      login(token, user);
      showAlert("success", message);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Login failed. Try again.";
      showAlert("danger", msg);
    }
  }

  useEffect(() => {
    if (!state) return;
    showAlert("success", state.message);
  }, [state, showAlert]);

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user) {
      navigate(getHomeRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-5" style={{"width": 500}}>
        <h1>Login Page</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email address</label>
            <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" aria-describedby="emailHelp" {...register("email")}/>
            {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" {...register("password")}/>
            {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button> Forgot Password? Login with OTP <Link className="link" to={ROUTES.AUTH.URLS.REQUEST_OTP}>here</Link>
        </form>
        <br />
        <div className="container-fluid">
          Don't have an account, please <Link className="link" to={ROUTES.AUTH.URLS.REGISTER}>Register</Link><br />
          Or navigate to <Link className="link" to={ROUTES.HOME}>Home</Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;