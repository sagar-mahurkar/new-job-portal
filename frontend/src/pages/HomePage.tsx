import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { jobApi } from "@/modules/job/job.api";
import type { PublicJob } from "@/modules/job/types/jobTypes";
import { COMPANY_SECTORS, EXPERIENCE_LEVELS, type CompanySector, type ExperienceLevel } from "@/shared/constants/enums";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const HomePage = () => {
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<PublicJob | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<{
    search: string;
    location: string;
    sector: CompanySector | "";
    experienceLevel: ExperienceLevel | "";
  }>({
    search: "",
    location: "",
    sector: "",
    experienceLevel: "",
  });

  const clearFilters = () => {
    setFilters({
      search: "",
      location: "",
      sector: "",
      experienceLevel: "",
    });
  };

  const applyFilters = async () => {
    setPage(1);
  };

  const onApplyJob = async () => {
    if (!selectedJob) return;
    
    setIsApplying(true);
    try {
      await jobApi.applyForJob(selectedJob.jobId);

      setJobs((prev) =>
        prev.filter((job) => job.jobId !== selectedJob.jobId)
      );

      setSelectedJob(null);
      setShowApplyModal(false);

      showAlert("success", "Applied for job successfully");
    } catch (err: any) {
      setShowApplyModal(false);
      const msg =
        err?.response?.data?.message || "Failed to apply for job.";

      showAlert("danger", msg);
    }

    setIsApplying(false);
  };

  const handleApply = (job: PublicJob) => {
    setSelectedJob(job);
    setShowApplyModal(true);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const result = await jobApi.getAllJobs({
        search: filters.search || undefined,
        location: filters.location || undefined,
        sector: filters.sector || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        page,
        limit,
      });

      setJobs(result.data);
      setTotal(result.meta.totalPages);
    };

    fetchJobs();
  }, [page, filters]);

  return (
    <div className="container-fluid bg-light">
      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Search */}
            <div className="col-md-3">
              <label htmlFor="search" className="form-label">
                Search
              </label>
              <input
                type="text"
                id="search"
                className="form-control"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="col-md-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                id="location"
                className="form-control"
                placeholder="e.g. Pune"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              />
            </div>

            {/* Sector */}
            <div className="col-md-3">
              <label htmlFor="sector" className="form-label">
                Sector
              </label>
              <select
                id="sector" 
                className="form-select"
                value={filters.sector}
                onChange={(e) => setFilters({ ...filters, sector: e.target.value as CompanySector | "" })}
              >
                <option value="">All sectors</option>

                {COMPANY_SECTORS.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience */}
            <div className="col-md-3">
              <label htmlFor="experienceLevel" className="form-label">
                Experience Level
              </label>
              <select
                id="experienceLevel"
                className="form-select"
                value={filters.experienceLevel}
                onChange={(e) => setFilters({ ...filters, experienceLevel: e.target.value as ExperienceLevel | "" })}
              >
                <option value="">All levels</option>

                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="d-flex justify-content-end gap-2 mt-3">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={clearFilters}
            >
              Clear
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={applyFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      {jobs.map((job) => (
        <div key={job.jobId} className="card mb-4">
          <div className="card-header">
            <h4 className="card-title">{job.title}</h4>
            <p className="card-text">{job.companyName}</p>
          </div>
          <div className="card-body">
            <p className="card-text"><i className="bi bi-geo-alt"></i> {job.location} | <i className="bi bi-briefcase"></i> {job.experienceLevel} | <i className="bi bi-mortarboard"></i> {job.minQualification} | {job.sector}</p>
            <p className="card-text">
              Posted On:{" "}
              {new Date(job.postedOn).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="card-footer">
            <div className="d-flex gap-2">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/jobs/${job.jobId}/details`)}
              >
                View Details
              </button>
              {user && user.role === "CANDIDATE" && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleApply(job)}
                >
                  Apply Now
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      {showApplyModal && selectedJob && (
        <div>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Apply For Job</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowApplyModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to apply for <strong>{selectedJob.title}</strong> job?</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Close</button>
                  <button type="button" className="btn btn-primary" onClick={onApplyJob} disabled={isApplying}>
                    {isApplying ? "Applying..." : "Apply Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}

      <nav aria-label="Job pagination">
        <ul className="pagination justify-content-center">

          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
          </li>

          {Array.from({ length: total }, (_, index) => {
            const pageNumber = index + 1;

            return (
              <li
                key={pageNumber}
                className={`page-item ${
                  page === pageNumber ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            );
          })}

          <li
            className={`page-item ${
              page === total ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => setPage(page + 1)}
              disabled={page === total}
            >
              Next
            </button>
          </li>

        </ul>
      </nav>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div className="container-fluid text-center bg-light fixed-bottom">
        <p className="mt-3 mb-0 text-muted">This is a project under IIT Madras Online BS Degree</p>
        <p><strong>&copy; 21f1005514@ds.study.iitm.ac.in</strong></p>
      </div>
    </div>
  )
}

export default HomePage;
