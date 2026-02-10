import { User } from "./user.entity";

export const mapUserToResponse = (user: User) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});
