import { useEffect, useState } from "react";
import { recruiterApi } from "../recruiter.api";
import type { RecruiterProfile } from "../types/recruiterTypes";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAlert } from "@/context/AlertContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateRecruiterProfileSchema } from "../schemas/recruiterSchemas";
import { COMPANY_SECTORS } from "@/shared/constants/enums";
import { useAuth } from "@/modules/auth/hooks/useAuth";

type UpdateRecruiterProfileInputs = z.infer<typeof updateRecruiterProfileSchema>;

const RecruiterProfilePage = () => {
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { showAlert } = useAlert();
  const { register,handleSubmit, reset, 
    formState: { errors, isSubmitting },} = useForm<UpdateRecruiterProfileInputs>({
    resolver: zodResolver(updateRecruiterProfileSchema),
  });

  const onSubmit: SubmitHandler<UpdateRecruiterProfileInputs> = async (data) => {
    try {
      const updatedProfile = await recruiterApi.updateMe(data);

      setProfile(updatedProfile);

      setShowEditModal(false)

      showAlert("success", "Profile updated successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to update profile.";
      showAlert("danger", msg);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await recruiterApi.getMe();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    reset({
      companyName: profile.companyName ?? "",
      companySector: profile.companySector ?? undefined,
      description: profile.description ?? "",
    });
  }, [profile, reset]);

  return (
    <>
      {profile && (
        <div>
          <h3>Recruiter Profile</h3>

          {user && (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}

          <p><strong>Company Name:</strong> {profile.companyName ?? "Not provided"}</p>
          <p><strong>Company Sector:</strong> {profile.companySector ?? "Not provided"}</p>
          <p><strong>Description:</strong> {profile.description ?? "Not provided"}</p>

          <div className="mb-3">
            <button type="button" className="btn btn-primary" onClick={() => setShowEditModal(true)}>
              Edit Profile
            </button>
          </div>
        </div>
      )}
      {showEditModal && (
        <div>
          <div className="modal show d-block" tabIndex={-1} style={{ display: "block" }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Update Recruiter Profile</h1>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    
                      <div className="mb-3">
                        <label htmlFor="companyName" className="form-label">Company Name</label>
                        <input type="text" className="form-control" id="companyName" {...register("companyName")} />
                        {errors.companyName && (
                          <div className="text-danger">
                            {errors.companyName.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" rows={3} {...register("description")} />
                        {errors.description && (
                          <div className="text-danger">
                            {errors.description.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <select className="form-select" {...register("companySector")}>
                          <option value="">Select sector</option>
                          {COMPANY_SECTORS.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                        {errors.companySector && (
                          <div className="text-danger">
                            {errors.companySector.message}
                          </div>
                        )}
                      </div>
                    
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

    </>
  )
}

export default RecruiterProfilePage;