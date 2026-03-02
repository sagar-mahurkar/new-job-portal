export const mapPublicJobResponse = (job: any) => {
  return {
    jobId: String(job.id),
    title: String(job.title),
    description: String(job.description),
    sector: String(job.sector),
    minQualification: String(job.minQualification),
    location: String(job.location),
    experienceLevel: String(job.experienceLevel),
    companyName: String(job.companyName),
    postedOn: new Date(job.createdAt).toISOString()
  }
}