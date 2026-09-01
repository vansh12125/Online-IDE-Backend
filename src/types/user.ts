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

export type {User as default};