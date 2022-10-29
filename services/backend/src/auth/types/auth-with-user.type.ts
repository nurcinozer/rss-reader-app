import { Auth, User } from '@prisma/client';

export type AuthWithUser = Auth & {
  user: User;
};
