import { ROUTES } from "@/routes/routes";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../auth.api";
import { useNavigate } from "react-router-dom";
import { getHomeRoute } from "../auth.routes";
import { loginOtpSchema } from "../schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAlert } from "@/context/AlertContext";
import { z } from "zod";

type LoginOtpInputs = z.infer<typeof loginOtpSchema>;

const LoginOTPPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  type LoginOtpLocationState = {
      email: string;
  };

  const { state } = useLocation() as {
      state: LoginOtpLocationState | null;
  };

  const initialEmail = state?.email ?? "";

  const { login, loading, isAuthenticated, user } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginOtpInputs>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: {
      email: initialEmail
    }
  });

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated && user) {
      navigate(getHomeRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  const onSubmit: SubmitHandler<LoginOtpInputs> = async (data) => {
    if (!initialEmail || !data.loginOtp) return;
    try {
      const { token, user, message } = await authApi.loginWithOtpFn(data);

      login(token, user);
      showAlert("success", message)
    } catch (err: any) {
      console.log(err);
    }
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-5" style={{"width": 500}}>
          <h3 className="mb-5">Login with OTP</h3>
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="row align-items-center g-3 mb-3">
              <div className="col-4 d-flex align-items-center">
                <label className="form-label mb-0" htmlFor="email">Email address</label>
              </div>
              <div className="col-8 d-flex align-items-center">
                <label className="form-label mb-0 text-warning-emphasis" >{initialEmail}</label>
              </div>
            </div>
            <div className="row align-items-center g-3 mb-3">
              <div className="col-4 d-flex align-items-center">
                <label className="form-label mb-0" htmlFor="otp">OTP</label>
              </div>
              <div className="col-4">
                <input type="text" className={`form-control ${errors.loginOtp ? "is-invalid" : ""}`} id="otp" {...register("loginOtp")}/>
                {errors.loginOtp && <div className="invalid-feedback d-block">{errors.loginOtp.message}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Logging in..." : "Login"}</button>
          </form>

          <p>Or Login with Password <Link className="link" to={ROUTES.AUTH.URLS.LOGIN}>here</Link></p>
          <p>
            Don't have an account, please <Link className="link" to={ROUTES.AUTH.URLS.REGISTER}>Register</Link><br />
            Or navigate to <Link className="link" to={ROUTES.HOME}>Home</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default LoginOTPPage;