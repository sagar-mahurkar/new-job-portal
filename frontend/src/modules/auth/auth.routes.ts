import { ROUTES } from "@/routes/routes";
import type { UserRole } from "@/shared/types/user";

export const roleHomeRoutes: Record<UserRole, string> = {
    CANDIDATE: ROUTES.CANDIDATE.URLS.DASHBOARD,
    RECRUITER: ROUTES.RECRUITER.URLS.DASHBOARD,
};

export function getHomeRoute(role: UserRole): string {
    return roleHomeRoutes[role];
}