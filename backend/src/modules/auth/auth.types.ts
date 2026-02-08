export interface AuthenticatedUser {
  id: string;
  role: 'RECRUITER' | 'CANDIDATE';
}