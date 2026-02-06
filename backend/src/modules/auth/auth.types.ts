export interface AuthenticatedUser {
  id: string;
  role: 'recruiter' | 'candidate';
}