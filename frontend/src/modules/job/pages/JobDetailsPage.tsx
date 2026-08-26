import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jobApi } from "../job.api";
import type { PublicJob } from "../types/jobTypes";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import ReactMarkdown from "react-markdown";
import { useAlert } from "@/context/AlertContext";

const JobDetailsPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<PublicJob | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!jobId) return;

    const fetchJob = async () => {
      const data = await jobApi.getOpenJobById(jobId);
      setJob(data);
    };

    fetchJob();
  }, [jobId]);

  const onApplyJob = async () => {
    if (!jobId) return;
    
    setIsApplying(true);
    try {
      await jobApi.applyForJob(jobId);

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

  if (!job) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-4">
      <h3>{job.title}</h3>

      <p>
        <strong>Company:</strong> {job.companyName}
      </p>

      <p>
        <strong>Location:</strong> {job.location}
      </p>

      <p>
        <strong>Sector:</strong> {job.sector}
      </p>

      <p>
        <strong>Experience Level:</strong> {job.experienceLevel}
      </p>

      <p>
        <strong>Minimum Qualification:</strong>{" "}
        {job.minQualification}
      </p>

      <p>
        <strong>Posted On:</strong>{" "}
        {new Date(job.postedOn).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      <hr />

      <ReactMarkdown>
        {job.description}
      </ReactMarkdown>

      {user && user.role === "CANDIDATE" && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => 
            setShowApplyModal(true)
          }
        >
          Apply Now
        </button>
      )}

      {showApplyModal && job && (
        <div>
          <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Apply For Job</h5>
                  <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowApplyModal(false)}></button>
                </div>
                <div className="modal-body">
                  <p>Are you sure you want to apply for <strong>{job.title}</strong> job?</p>
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
      <br />
      <br />
      <br />
    </div>
  );
};

export default JobDetailsPage;