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
    jobId: row.jobId,
    title: row.title,
    status: row.status,
    appliedAt: row.appliedAt
      ? new Date(row.appliedAt).toISOString()
      :null
  }
}
