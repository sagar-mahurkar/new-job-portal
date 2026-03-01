export const mapRecruiterOverviewResponse = (
  jobStats: any,
  appStats: any
) => {
  return {
    jobs: {
      total: Number(jobStats?.total ?? 0),
      open: Number(jobStats?.open ?? 0),
      closed: Number(jobStats?.closed ?? 0)
    },
    applications: {
      total: Number(appStats?.total ?? 0),
      byStatus: {
        APPLIED: Number(appStats?.applied ?? 0),
        SHORTLISTED: Number(appStats?.shortlisted ?? 0),
        REJECTED: Number(appStats?.rejected ?? 0)
      }
    }
  };
};


export const mapRecruiterJobDashboardResponse = (row: any) => {
  return {
    jobId: String(row.jobId),
    title: String(row.title),
    status: String(row.status),
    applicantCount: Number(row?.applicantCount ?? 0),
    applied: Number(row?.applied ?? 0),
    shortlisted: Number(row?.shortlisted ?? 0),
    rejected: Number(row?.rejected ?? 0)
  }
}
