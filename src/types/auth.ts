interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export type { RegisterRequest, LoginRequest };
