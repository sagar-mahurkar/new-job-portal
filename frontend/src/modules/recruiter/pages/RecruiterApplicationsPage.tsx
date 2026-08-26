import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { recruiterApi } from "../recruiter.api";
import type { RecruiterApplication, RecruiterJob } from "../types/recruiterTypes";
import { APPLICATION_STATUSES } from "@/shared/constants/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { updateApplicationStatusSchema, type UpdateApplicationStatusInputs } from "../schemas/recruiterSchemas";
import { useAlert } from "@/context/AlertContext";

const RecruiterApplicationsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [job, setJob] = useState<RecruiterJob | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<RecruiterApplication | null>(null);

  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const [ applications, setApplications ] = useState<RecruiterApplication[]>([]);
  const { showAlert } = useAlert();

  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    reset: resetUpdate,
    formState: {
      errors: updateErrors,
      isSubmitting: isUpdating,
    },
  } = useForm<UpdateApplicationStatusInputs>({
    resolver: zodResolver(updateApplicationStatusSchema),
  });

  const onUpdateApplication: SubmitHandler<UpdateApplicationStatusInputs> = async (data) => {
    if (!selectedApplication) return;

    try {
      const updatedApplication = await recruiterApi.updateApplciationStatus(selectedApplication.id, data);

      setApplications((prev) =>
        prev.map((application) =>
          application.id === updatedApplication.id ? updatedApplication : application
        )
      );

      resetUpdate();

      setShowApplicationModal(false)

      showAlert("success", "Application status updated successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to create job.";
      
      setShowApplicationModal(false)
      showAlert("danger", msg);
    }
  };

  useEffect(() => {
    if (!jobId) return;

    const fetchApplications = async () => {
      const applicationsData = await recruiterApi.getJobApplications(jobId);
      setApplications(applicationsData);
      const jobData = await recruiterApi.getJobById(jobId);
      setJob(jobData);
    };

    fetchApplications();
  }, [jobId]);

  return (
    <>
      {job && (
        <div className="text">
          <h3>{job.title}</h3>
          <p>{job.location} | {job.jobSector} | {job.experienceLevel}</p>
          <p>{job.vacancies} Vacancies | {job.applicantCount} Applicants</p>
        </div>
      )}
      <table className="table">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Qualification</th>
            <th>Experience</th>
            <th>Applied At</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.map((application) => (
            <tr key={application.id}>
              <td>{application.candidate?.name}</td>
              <td>{application.candidateProfile.qualification ?? "Not provided"}</td>
              <td>
                {application.candidateProfile.experienceMonths ?? "Not provided"}
              </td>
              <td>
                {new Date(application.appliedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </td>
              <td>
                <span
                  className={`badge ${
                    application.status === "APPLIED"
                      ? "text-bg-warning"
                      : application.status === "SHORTLISTED"
                      ? "text-bg-success"
                      : "text-bg-danger"
                  }`}
                >
                {application.status}
                </span>
              </td>
              <td>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    setSelectedApplication(application);
                    resetUpdate({
                      status: application.status
                    });
                    
                    setShowApplicationModal(true);
                  }}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showApplicationModal && selectedApplication && (
        <>
          <div
            className="modal show d-block"
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleUpdateSubmit(onUpdateApplication)}>
                  <div className="modal-header">
                    <h4 className="modal-title">
                      Candidate Details
                    </h4>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowApplicationModal(false)}
                    />
                  </div>

                  <div className="modal-body">

                    <h5>
                      {selectedApplication.candidate.name}
                    </h5>

                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedApplication.candidate.email}
                    </p>

                    <hr />

                    <h5>Candidate Profile</h5>

                    <p>
                      <strong>Qualification:</strong>{" "}
                      {selectedApplication.candidateProfile.qualification}
                    </p>

                    <p>
                      <strong>Experience:</strong>{" "}
                      {selectedApplication.candidateProfile.experienceMonths} months
                    </p>

                    <p>
                      <strong>Current Sector:</strong>{" "}
                      {selectedApplication.candidateProfile.currentSector}
                    </p>

                    <p>
                      <strong>Introduction:</strong>{" "}
                      {selectedApplication.candidateProfile.briefIntro || "Not provided"}
                    </p>

                    <hr />

                    <h5>Links</h5>

                    {selectedApplication.candidateProfile.resumeUrl && (
                      <p>
                        <a
                          href={selectedApplication.candidateProfile.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Resume
                        </a>
                      </p>
                    )}

                    {selectedApplication.candidateProfile.linkedinUrl && (
                      <p>
                        <a
                          href={selectedApplication.candidateProfile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      </p>
                    )}

                    {selectedApplication.candidateProfile.githubUrl && (
                      <p>
                        <a
                          href={selectedApplication.candidateProfile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          GitHub
                        </a>
                      </p>
                    )}

                    {selectedApplication.candidateProfile.portfolioUrl && (
                      <p>
                        <a
                          href={selectedApplication.candidateProfile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Portfolio
                        </a>
                      </p>
                    )}

                    <hr />

                    <p>
                      <strong>Applied:</strong>{" "}
                      {new Date(selectedApplication.appliedAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      <select className="form-select" {...registerUpdate("status")}>
                        <option value="">Select</option>
                        {APPLICATION_STATUSES.map((status) => (
                          <option value={status} key={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {updateErrors.status && (
                        <span className="text-danger">
                          {updateErrors.status.message}
                        </span>
                      )}
                    </p>

                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowApplicationModal(false)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isUpdating}
                    >
                      {isUpdating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
};

export default RecruiterApplicationsPage;