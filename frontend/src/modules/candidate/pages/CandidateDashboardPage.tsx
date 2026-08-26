import { useEffect, useState } from "react";
import { candidateApi } from "../candidate.api";
import type { CandidateDashboardApplication, CandidateDashboardApplicationsResponse, CandidateDashboardSummaryResponse } from "../types/candidateTypes";
import type { PublicJob } from "@/modules/job/types/jobTypes";
import { jobApi } from "@/modules/job/job.api";
import { useAuth } from "@/modules/auth/hooks/useAuth";

const CandidateDashboardPage = () => {
  const [summary, setSummary] = useState<CandidateDashboardSummaryResponse | null>(null);
  const [applications, setApplications] = useState<CandidateDashboardApplicationsResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CandidateDashboardApplication | null>(null);

  const { user } = useAuth();

  const [showApplicationModal, setShowApplicationModal] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      const data = await candidateApi.getDashboardSummary();
      setSummary(data);
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await candidateApi.getDashboardApplications();
      setApplications(data);
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (!selectedApplication) return;

    const fetchJob = async () => {
      const job = await jobApi.getOpenJobById(selectedApplication.jobId);
      setSelectedJob(job);
    }

    fetchJob();
  }, [selectedApplication]);

  return (
    <div>
      {user && user.name && (
        <h3 className="mb-3">
          Welcome, {user.name}!
        </h3>
      )}

      {summary && (
        <div className="mb-3">
          <div className="row g-3 p-3">
            <div className="col">
              <div className="card border-primary">
                <div className="card-body text-center">
                  <h5 className="card-title text-primary">Total Applications</h5>
                  <h2>{summary.totalApplications}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-warning">
                <div className="card-body text-center">
                  <h5 className="card-title text-warning">Applied</h5>
                  <h2>{summary.byStatus.APPLIED}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-success">
                <div className="card-body text-center">
                  <h5 className="card-title text-success">Shortlisted</h5>
                  <h2>{summary.byStatus.SHORTLISTED}</h2>
                </div>
              </div>
            </div>
            <div className="col">
              <div className="card border-danger">
                <div className="card-body text-center">
                  <h5 className="card-title text-danger">Rejected</h5>
                  <h2>{summary.byStatus.REJECTED}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {applications && applications.data.length === 0 && (
        <p>No applications found.</p>
      )}

      {applications && applications.data.length > 0 && (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Applied At</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.data.map((application) => (
                <tr key={application.jobId}>
                  <td>{application.title}</td>
                  <td>{application.companyName}</td>
                  <td>{new Date(application.appliedAt ?? "").toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}</td>
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
        </div>
      )}
      {showApplicationModal && selectedApplication && selectedJob && (
        <>
          <div
            className="modal show d-block"
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h4 className="modal-title">
                    Application Details
                  </h4>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowApplicationModal(false)}
                  />
                </div>

                <div className="modal-body">

                  <h3>
                    {selectedApplication.title}
                  </h3>

                  <p>
                    <strong>Applied At:</strong>{" "}
                    {new Date(selectedApplication.appliedAt ?? "").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>

                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(selectedApplication.updatedAt ?? "").toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {selectedApplication.status}
                  </p>

                  <hr />

                  <h5>
                    Job Details
                  </h5>

                  <p>
                    <strong>Company:</strong>{" "}
                    {selectedJob.companyName}
                  </p>

                  <p>
                    <strong>Location:</strong>{" "}
                    {selectedJob.location}
                  </p>

                  <p>
                    <strong>Sector:</strong>{" "}
                    {selectedJob.sector}
                  </p>

                  <p>
                    <strong>Level:</strong>{" "}
                    {selectedJob.experienceLevel}
                  </p>

                  <p>
                    <strong>Minimum Qualification:</strong>{" "}
                    {selectedJob.minQualification}
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
                </div>

              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  )
};

export default CandidateDashboardPage;