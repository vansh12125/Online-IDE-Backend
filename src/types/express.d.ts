declare global {
  namespace Express {
    interface Request {
      user: {
        uId: string;
        username: string;
        sId: string;
      };
    }
  }
}

export {};