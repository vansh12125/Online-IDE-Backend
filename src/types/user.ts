import { OAuthProvider } from "../generated/prisma/enums";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface OAuthUser {
  oAuthId: string;
  email: string;
  name: string;
  avatar?: string;
  isVerified: boolean;
  provider: OAuthProvider;
}

export type { User as default };
export { OAuthUser };
