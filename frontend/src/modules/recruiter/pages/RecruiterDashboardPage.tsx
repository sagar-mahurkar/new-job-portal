import { useEffect, useState } from "react";
import { recruiterApi } from "../recruiter.api";
import type { CreateJobInputs, RecentApplication, RecruiterJobDashboard, RecruiterOverviewResponse } from "../types/recruiterTypes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useNavigate } from "react-router";
import { ROUTES } from "@/routes/routes";
import { useAlert } from "@/context/AlertContext";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createJobSchema } from "../schemas/recruiterSchemas";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS, EXPERIENCE_LEVELS } from "@/shared/constants/enums";

const RecruiterDashboardPage = () => {
  const [overview, setOverview] = useState<RecruiterOverviewResponse | null>(null);
  const [jobs, setJobs] = useState<RecruiterJobDashboard[] | null>(null);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: {
      errors: createErrors,
      isSubmitting: isCreating,
    },
  } = useForm<CreateJobInputs>({
    resolver: zodResolver(createJobSchema),
  });
  const { user } = useAuth();

  const onCreateJob: SubmitHandler<CreateJobInputs> = async (data) => {
    try {
      await recruiterApi.createJob(data);

      resetCreate();

      setShowCreateModal(false)

      showAlert("success", "Job created successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to create job.";
      showAlert("danger", msg);
    }
  };

  useEffect(() => {
    const fetchOverview = async () => {
      const data = await recruiterApi.getDashboardOverview();
      setOverview(data);
    };

    fetchOverview();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      const data = await recruiterApi.getDashboardJobs();
      setJobs(data.data);
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchRecentApplications = async () => {
      const data = await recruiterApi.recentApplications();
      setRecentApplications(data);
    };

    fetchRecentApplications();
  }, []);

  return (
    <div>
      {user && user.name && (
        <h3 className="mb-3">Welcome, {user.name}!</h3>
      )}

      {overview && (
        <div>
          <div className="row mb-3">
            <div className="col p-3">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="card-title"><i className="bi bi-briefcase"></i> Jobs</h4>
                  <h6 className="card-subtitle mb-2 text-body-secondary">Total: {overview.jobs.total}</h6>
                  <div className="row">
                    <div className="col border-end">
                      <h5 className="text-success">Open</h5>
                      <h5>{overview.jobs.open}</h5>
                    </div>
                    <div className="col">
                      <h5 className="text-danger">Closed</h5>
                      <h5>{overview.jobs.closed}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col p-3">
              <div className="card">
                <div className="card-body text-center">
                  <h4 className="card-title"><i className="bi bi-people"></i> Applications</h4>
                  <h6 className="card-subtitle mb-2 text-body-secondary">Total: {overview.applications.total}</h6>
                  <div className="row">
                    <div className="col border-end">
                      <h5 className="text-primary">Applied</h5>
                      <h5>{overview.applications.byStatus.APPLIED}</h5>
                    </div>
                    <div className="col border-end">
                      <h5 className="text-success">Shortlisted</h5>
                      <h5>{overview.applications.byStatus.SHORTLISTED}</h5>
                    </div>
                    <div className="col">
                      <h5 className="text-danger">Rejected</h5>
                      <h5>{overview.applications.byStatus.REJECTED}</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <h4>Quick Actions</h4>
            <div className="card mb-3">
              {jobs && jobs.length > 0 && (
                <div className="card-body">
                  <h5 className="card-title">My Jobs</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Job</th>
                        <th>Applications</th>
                        <th>Applied</th>
                        <th>Shortlisted</th>
                        <th>Rejected</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.jobId}>
                          <td>{job.title}</td>
                          <td>{job.applicantCount}</td>
                          <td>{job.applied}</td>
                          <td>{job.shortlisted}</td>
                          <td>{job.rejected}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="row g-3">
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Job
                </button>
              </div>
              <div className="col-1">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    navigate(ROUTES.RECRUITER.URLS.JOBS);
                  }}
                >
                  My Jobs
                </button>
              </div>
            </div>
          </div>
          <div className="card mb-3">
            <div className="card-body">
              <h4>Recent Applications</h4>
              {recentApplications && recentApplications.length > 0 && (
                <div>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Job</th>  
                        <th>Applied At</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApplications.map((application) => (
                        <tr key={application.id}>
                          <td>{application.candidateName}</td>
                          <td>{application.jobTitle}</td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreateModal && (
        <div>
          <div className="modal show d-block" tabIndex={-1} style={{ display: "block" }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleCreateSubmit(onCreateJob)}>
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Create Job</h1>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowCreateModal(false)}></button>
                  </div>
                  <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Job Title</label>
                        <input type="text" className="form-control" id="title" {...registerCreate("title")} />
                        {createErrors.title && (
                          <div className="text-danger">
                            {createErrors.title.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" rows={1} {...registerCreate("description")} />
                        {createErrors.description && (
                          <div className="text-danger">
                            {createErrors.description.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="minQualification" className="form-label">Minimum Qualification</label>
                        <select className="form-select" {...registerCreate("minQualification")}>
                          <option value="">Select</option>
                          {CANDIDATE_QUALIFICATIONS.map((qualification) => (
                            <option key={qualification} value={qualification}>
                              {qualification}
                            </option>
                          ))}
                        </select>
                        {createErrors.minQualification && (
                          <div className="text-danger">
                            {createErrors.minQualification.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="jobSector" className="form-label">Job Sector</label>
                        <select className="form-select" {...registerCreate("jobSector")}>
                          <option value="">Select</option>
                          {COMPANY_SECTORS.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                        {createErrors.jobSector && (
                          <div className="text-danger">
                            {createErrors.jobSector.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="vacancies" className="form-label">Vacancies</label>
                        <input type="number" className="form-control" id="vacancies" {...registerCreate("vacancies", { valueAsNumber: true })} />
                        {createErrors.vacancies && (
                          <div className="text-danger">
                            {createErrors.vacancies.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input type="text" className="form-control" id="location" {...registerCreate("location")} />
                        {createErrors.location && (
                          <div className="text-danger">
                            {createErrors.location.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="experienceLevel" className="form-label">Experience Level</label>
                        <select className="form-select" {...registerCreate("experienceLevel")}>
                          <option value="">Select</option>
                          {EXPERIENCE_LEVELS.map((experienceLevel) => (
                            <option key={experienceLevel} value={experienceLevel}>
                              {experienceLevel}
                            </option>
                          ))}
                        </select>
                        {createErrors.experienceLevel && (
                          <div className="text-danger">
                            {createErrors.experienceLevel.message}
                          </div>
                        )}
                      </div>                    
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Close</button>
                    <button type="submit" className="btn btn-primary" disabled={isCreating}>
                      {isCreating ? "Creating..." : "Create"}
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
  )
};

export default RecruiterDashboardPage;