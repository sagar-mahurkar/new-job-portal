import { useEffect, useState } from "react";
import { recruiterApi } from "../recruiter.api";
import type { RecruiterJob } from "../types/recruiterTypes";
import { useAlert } from "@/context/AlertContext";
import { createJobSchema, updateJobSchema, type CreateJobInputs, type UpdateJobInputs } from "../schemas/recruiterSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CANDIDATE_QUALIFICATIONS, COMPANY_SECTORS, EXPERIENCE_LEVELS } from "@/shared/constants/enums";
import { Tooltip } from "bootstrap";

const RecruiterJobsPage = () => {
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<RecruiterJob | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: {
      errors: editErrors,
      isSubmitting: isUpdating,
    },
  } = useForm<UpdateJobInputs>({
    resolver: zodResolver(updateJobSchema),
  });

  const handleViewApplications = (jobId: string) => {
    navigate(`/recruiter/jobs/${jobId}/applications`);
  };

  const onCreateJob: SubmitHandler<CreateJobInputs> = async (data) => {
    try {
      const createJob = await recruiterApi.createJob(data);

      setJobs((prev) => [...prev, createJob]);

      resetCreate();

      setShowCreateModal(false)

      showAlert("success", "Job created successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to create job.";
      showAlert("danger", msg);
    }
  };

  const onEditJob: SubmitHandler<UpdateJobInputs> = async (data) => {
    if (!selectedJob) return;

    try {
      const updatedJob = await recruiterApi.updateJob(
        selectedJob.id,
        data
      );

      setJobs((prev) =>
        prev.map((job) =>
          job.id === updatedJob.id ? updatedJob : job
        )
      );

      resetEdit();
      setSelectedJob(null);
      setShowEditModal(false);

      showAlert("success", "Job updated successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to update job.";

      showAlert("danger", msg);
    }
  };

  const onDeleteJob = async () => {
    if (!selectedJob) return;
    
    setIsDeleting(true);
    try {
      await recruiterApi.deleteJob(selectedJob.id);

      setJobs((prev) =>
        prev.filter((job) => job.id !== selectedJob.id)
      );

      setSelectedJob(null);
      setShowDeleteModal(false);

      showAlert("success", "Job deleted successfully");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Failed to delete job.";

      showAlert("danger", msg);
    }

    setIsDeleting(false);
  };

  const fetchJobs = async () => {
    const data = await recruiterApi.getMyJobs();
    setJobs(data);
  };
  
  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    const tooltipElements = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );

    tooltipElements.forEach((element) => {
      new Tooltip(element);
    });

    return () => {
      tooltipElements.forEach((element) => {
        Tooltip.getInstance(element)?.dispose();
      });
    };
  }, []);

  const handleStatusChange = async (
    jobId: string,
    status: "OPEN" | "CLOSED"
  ) => {
    await recruiterApi.updateJobStatus(jobId, status);

    // refresh jobs
    await fetchJobs();
  };

  return (
    <div>
      <h3 className="mb-3">My Jobs</h3>

      {jobs.length === 0 ? (
        <div className="alert alert-info">
          You haven't posted any jobs yet.
        </div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Location</th>
              <th scope="col">Vacancies</th>
              <th scope="col">Sector</th>
              <th scope="col">Qualification</th>
              <th scope="col">Experience Level</th>
              <th scope="col">Status</th>
              <th scope="col">Applicants</th>
              <th scope="col">Actions</th>  
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.location}</td>
                <td>{job.vacancies}</td>
                <td>{job.jobSector}</td>
                <td>{job.minQualification}</td>
                <td>{job.experienceLevel}</td>
                <td>
                  <span className={`badge bg-${job.status === "OPEN" ? "success" : "danger"}`}>
                    {job.status}
                  </span>
                </td>
                <td>{job.applicantCount}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      title="View applications"
                      onClick={() => handleViewApplications(job.id)}
                    >
                      <i className="bi bi-file-text"></i>
                    </button>
                    <button 
                      type="button"
                      className="btn btn-outline-secondary"
                      title="Edit job"
                      onClick={() => {
                        setSelectedJob(job);

                        resetEdit({
                          title: job.title,
                          description: job.description,
                          minQualification: job.minQualification,
                          jobSector: job.jobSector,
                          vacancies: job.vacancies,
                          location: job.location,
                          experienceLevel: job.experienceLevel,
                        });

                        setShowEditModal(true);
                      }}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    {job.status === "OPEN" ? (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => handleStatusChange(job.id, "CLOSED")}
                      >
                        Close Job
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleStatusChange(job.id, "OPEN")}
                      >
                        Reopen
                      </button>
                    )}
                    <button 
                      type="button" 
                      className="btn btn-outline-danger"
                      title="Delete job"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowDeleteModal(true);
                      }}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
        
      <button 
        type="button" 
        className="btn btn-primary" 
        onClick={() => setShowCreateModal(true)}
      >
        Create Job
      </button>

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

      {showEditModal && selectedJob && (
        <div>
          <div className="modal show d-block" tabIndex={-1} style={{ display: "block" }} aria-modal="true" role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <form onSubmit={handleEditSubmit(onEditJob)}>
                  <div className="modal-header">
                    <h1 className="modal-title fs-5">Edit Job</h1>
                    <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowEditModal(false)}></button>
                  </div>
                  
                  <div className="modal-body">
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Job Title</label>
                        <input type="text" className="form-control" id="title" {...registerEdit("title")} />
                        {editErrors.title && (
                          <div className="text-danger">
                            {editErrors.title.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea className="form-control" id="description" rows={1} {...registerEdit("description")} />
                        {editErrors.description && (
                          <div className="text-danger">
                            {editErrors.description.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="minQualification" className="form-label">Minimum Qualification</label>
                        <select className="form-select" {...registerEdit("minQualification")}>
                          <option value="">Select</option>
                          {CANDIDATE_QUALIFICATIONS.map((qualification) => (
                            <option key={qualification} value={qualification}>
                              {qualification}
                            </option>
                          ))}
                        </select>
                        {editErrors.minQualification && (
                          <div className="text-danger">
                            {editErrors.minQualification.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="jobSector" className="form-label">Job Sector</label>
                        <select className="form-select" {...registerEdit("jobSector")}>
                          <option value="">Select</option>
                          {COMPANY_SECTORS.map((sector) => (
                            <option key={sector} value={sector}>
                              {sector}
                            </option>
                          ))}
                        </select>
                        {editErrors.jobSector && (
                          <div className="text-danger">
                            {editErrors.jobSector.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="vacancies" className="form-label">Vacancies</label>
                        <input type="number" className="form-control" id="vacancies" {...registerEdit("vacancies", { valueAsNumber: true })} />
                        {editErrors.vacancies && (
                          <div className="text-danger">
                            {editErrors.vacancies.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input type="text" className="form-control" id="location" {...registerEdit("location")} />
                        {editErrors.location && (
                          <div className="text-danger">
                            {editErrors.location.message}
                          </div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="experienceLevel" className="form-label">Experience Level</label>
                        <select className="form-select" {...registerEdit("experienceLevel")}>
                          <option value="">Select</option>
                          {EXPERIENCE_LEVELS.map((experienceLevel) => (
                            <option key={experienceLevel} value={experienceLevel}>
                              {experienceLevel}
                            </option>
                          ))}
                        </select>
                        {editErrors.experienceLevel && (
                          <div className="text-danger">
                            {editErrors.experienceLevel.message}
                          </div>
                        )}
                      </div>                    
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Close</button>
                    <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                      {isUpdating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>  
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      {showDeleteModal && selectedJob && (
        <div>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Job</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowDeleteModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to delete <strong>{selectedJob.title}</strong> job?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Close</button>
                  <button type="button" className="btn btn-danger" onClick={onDeleteJob} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  )
};

export default RecruiterJobsPage;