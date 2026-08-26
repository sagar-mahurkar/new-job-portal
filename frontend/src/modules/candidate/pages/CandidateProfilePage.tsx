import { useEffect, useState } from "react";
import { candidateApi } from "../candidate.api";
import type { CandidateProfile } from "../types/candidateTypes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useAlert } from "@/context/AlertContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { updateCandidateProfileSchema, type UpdateCandidateProfileInputs } from "../schemas/candidateSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS } from "@/shared/constants/enums";

const CandidateProfilePage = () => {
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const { register,handleSubmit, reset, 
    formState: { errors, isSubmitting },} = useForm<UpdateCandidateProfileInputs>({
    resolver: zodResolver(updateCandidateProfileSchema),
  });

  const onSubmit: SubmitHandler<UpdateCandidateProfileInputs> = async (data: UpdateCandidateProfileInputs) => {
    try {
      const updatedProfile = await candidateApi.updateMe(data);

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
      const data = await candidateApi.getMe();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (!profile) return;

    reset({
      currentSector: profile.currentSector,
      experienceMonths: profile.experienceMonths,
      qualification: profile.qualification,
      briefIntro: profile.briefIntro,
      resumeUrl: profile.resumeUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
      portfolioUrl: profile.portfolioUrl ?? "",
    });
  }, [profile, reset]);

  return (
    <div>
      {profile && (
        <div>
          <h3>Candidate Profile</h3>

          {user && (
            <div>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          )}

          <p><strong>Current Sector:</strong> {profile.currentSector ?? "Not provided"}</p>
          <p><strong>Experience in Months:</strong> {profile.experienceMonths ?? "Not provided"}</p>
          <p><strong>Qualification:</strong> {profile.qualification ?? "Not provided"}</p>
          <p><strong>Brief Intro:</strong> {profile.briefIntro ?? "Not provided"}</p>
          <p><strong>Resume:</strong> {profile.resumeUrl ?? "Not provided"}</p>
          <p><strong>LinkedIn:</strong> {profile.linkedinUrl ?? "Not provided"}</p>
          <p><strong>GitHub:</strong> {profile.githubUrl ?? "Not provided"}</p>
          <p><strong>Portfolio:</strong> {profile.portfolioUrl ?? "Not provided"}</p>

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
                    <h1 className="modal-title fs-5">Update Candidate Profile</h1>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="currentSector" className="form-label">Current Sector</label>
                      <select className="form-select" {...register("currentSector")}>
                        <option value="">Select</option>
                        {COMPANY_SECTORS.map((sector) => (
                          <option key={sector} value={sector}>
                            {sector}
                          </option>
                        ))}
                      </select>
                      {errors.currentSector && (
                        <div className="text-danger">
                          {errors.currentSector.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="epxperienceMonths" className="form-label">Experience in Months</label>
                      <input type="number" className="form-control" id="experienceMonths" {...register("experienceMonths", { valueAsNumber: true })} />
                      {errors.experienceMonths && (
                        <div className="text-danger">
                          {errors.experienceMonths.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="qualification" className="form-label">Qualification</label>
                      <select className="form-select" {...register("qualification")}>
                        <option value="">Select</option>
                        {CANDIDATE_QUALIFICATIONS.map((qualification) => (
                          <option key={qualification} value={qualification}>
                            {qualification}
                          </option>
                        ))}
                      </select>
                      {errors.qualification && (
                        <div className="text-danger">
                          {errors.qualification.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="briefIntro" className="form-label">Brief Intro</label>
                      <input type="text" className="form-control" id="briefIntro" {...register("briefIntro")} />
                      {errors.briefIntro && (
                        <div className="text-danger">
                          {errors.briefIntro.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="resumeUrl" className="form-label">Resume</label>
                      <input type="text" className="form-control" id="resumeUrl" {...register("resumeUrl")} />
                      {errors.resumeUrl && (
                        <div className="text-danger">
                          {errors.resumeUrl.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="linkedinUrl" className="form-label">LinkedIn</label>
                      <input type="text" className="form-control" id="linkedinUrl" {...register("linkedinUrl")} />
                      {errors.linkedinUrl && (
                        <div className="text-danger">
                          {errors.linkedinUrl.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="githubUrl" className="form-label">GitHub</label>
                      <input type="text" className="form-control" id="githubUrl" {...register("githubUrl")} />
                      {errors.githubUrl && (
                        <div className="text-danger">
                          {errors.githubUrl.message}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="portfolioUrl" className="form-label">Portfolio</label>
                      <input type="text" className="form-control" id="portfolioUrl" {...register("portfolioUrl")} />
                      {errors.portfolioUrl && (
                        <div className="text-danger">
                          {errors.portfolioUrl.message}
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
    </div>
  );
};

export default CandidateProfilePage;