export const mapCandidateDashboardSummaryResponse = ( summary: any) => {
  return {
    totalApplications: Number(summary.total),
    byStatus: {
      APPLIED: Number(summary.applied),
      SHORTLISTED: Number(summary.shortlisted),
      REJECTED: Number(summary.rejected)
    }
  }
}

export const mapCandidateDashboardApplicationsResponse = ( row: any ) => {
  return {
    jobId: row.jobPosting.id,
    companyName: row.jobPosting.recruiter.companyName,
    title: row.jobPosting.title,
    status: row.status,
    appliedAt: row.createdAt
      ? new Date(row.createdAt).toISOString()
      :null,
    updatedAt: row.updatedAt
      ? new Date(row.updatedAt).toISOString()
      :null
  }
}
