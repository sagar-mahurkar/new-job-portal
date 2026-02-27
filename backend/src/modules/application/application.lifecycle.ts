import { ApplicationStatus } from "@/common/enums"

const transitionMatrix: Record<
  ApplicationStatus,
  Set<ApplicationStatus>
> = {
  APPLIED: new Set(["SHORTLISTED", "REJECTED"]),
  SHORTLISTED: new Set(["REJECTED"]),
  REJECTED: new Set([])
};

export const isValidTransition = (
  from: ApplicationStatus, 
  to: ApplicationStatus
): boolean => {
  // idempotent safe
  if (from === to) return true;

  return transitionMatrix[from]?.has(to) ?? false;
}