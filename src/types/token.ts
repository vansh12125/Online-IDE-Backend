interface ClientInfo {
  ipAddress: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
}

interface RefreshToken {
  id: string;
  sessionId: string;
  userId: string;
  tokenHash:string;
  clientInfo?: ClientInfo;
  revoked: boolean;
  createdAt: Date;
  expireAt: Date;
  updatedAt: Date;
}

interface CreateRefreshToken {
  sessionId: string;
  userId: string;
  tokenHash: string;
  clientInfo: ClientInfo;
  expireAt: Date;
}

export type { ClientInfo, RefreshToken,CreateRefreshToken };
