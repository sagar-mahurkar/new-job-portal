import { ROUTES } from "@/routes/routes";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../auth.api";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestOtpSchema } from "../schemas/authSchemas";
import { z } from "zod";

type RequestOtpInputs = z.infer<typeof requestOtpSchema>;

const RequestOTPPage = () => {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RequestOtpInputs>({
    resolver: zodResolver(requestOtpSchema)
  });

  const onSubmit: SubmitHandler<RequestOtpInputs> = async (data) => {
    if (!data.email) return;
    const { message } = await authApi.requestOtpFn(data);
    console.log(message);
    navigate(ROUTES.AUTH.URLS.LOGIN_OTP, {state: { email: data.email }});
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow p-5" style={{"width": 500}}>
          <h3 className="mb-3">Login with OTP</h3>
          <form className="mb-5" onSubmit={handleSubmit(onSubmit)}>
            <div className="row align-items-center g-3 mb-3">
              <div className="col-4 d-flex align-items-center">
                <label className="form-label mb-0" htmlFor="email">Email address</label>
              </div>
              <div className="col-8 d-flex align-items-center">
                <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" aria-describedby="emailHelp" {...register("email")}/>
                {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Requesting otp..." : "Request OTP"}</button>
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
};

export default RequestOTPPage;
