import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { authApi } from "../auth.api";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { useAlert } from "@/context/AlertContext";
import { signupSchema } from "../schemas/authSchemas";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type RegisterInputs = z.infer<typeof signupSchema>;

const RegisterPage = () => {
  const {  register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInputs>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: "CANDIDATE"
    }
  });

  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      const { message } = await authApi.signup(data);
      showAlert("success", message);  
      navigate(ROUTES.AUTH.URLS.LOGIN);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Registration failed. Try again.";
      showAlert("danger", msg);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow p-5" style={{"width": 500}}>
        <h1>Register Page</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label" htmlFor="name">Name</label>
            <input type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} id="name" {...register("name")}/>
            {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="email">Email address</label>
            <input type="email" className={`form-control ${errors.email ? "is-invalid" : ""}`} id="email" aria-describedby="emailHelp" {...register("email")}/>
            {errors.email && <div className="invalid-feedback d-block">{errors.email.message}</div>}
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">Password</label>
            <input type="password" className={`form-control ${errors.password ? "is-invalid" : ""}`} id="password" {...register("password")}/>
            {errors.password && <div className="invalid-feedback d-block">{errors.password.message}</div>}
          </div>
          <br />
          <div className="row">
            <div className="col-2">
              <label className="form-check-label">
                Role
              </label>
            </div>
            <div className="form-check col-5">
              <input className="form-check-input" type="radio" id="candidate" value="CANDIDATE" {...register("role")}/>
              <label className="form-check-label" htmlFor="candidate">
                Candidate
              </label>
            </div>
            <div className="form-check col-5">
              <input className="form-check-input" type="radio" id="recruiter" value="RECRUITER" {...register("role")}/>
              <label className="form-check-label" htmlFor="recruiter">
                Recruiter
              </label>
            </div>
          </div>
          <br />
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
        </form>
        <br />
        <div className="container-fluid">
          Already have an account, please <Link className="link" to={ROUTES.AUTH.URLS.LOGIN}>Login</Link><br />
          Or navigate to <Link className="link" to={ROUTES.HOME}>Home</Link>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage;