import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import { saveTokenInDb } from "../repositories/refresh-token.repository";
import { ClientInfo, RefreshToken } from "../types";

interface TokenPayload extends JwtPayload {
  uid: string;
  username: string;
  sId: string;
  type: "acc" | "ref";
}

const config = {
  access: {
    secret: String(process.env.JWT_TOKEN_ACCESS_SECRET),
    expiry: Number(process.env.ACCESS_TOKEN_EXPIRY),
  },
  refresh: {
    secret: String(process.env.JWT_TOKEN_REFRESH_SECRET),
    expiry: Number(process.env.REFRESH_TOKEN_EXPIRY),
  },
  issuer: String(process.env.JWT_TOKEN_ISSUER),
};

const generateAccessToken = (
  userId: string,
  username: string,
  sessionId: string,
): string => {
  return jwt.sign(
    {
      uid: userId,
      username: username,
      type: "acc",
      sId:sessionId
    } as TokenPayload,
    config.access.secret,
    {
      expiresIn: config.access.expiry,
      issuer: config.issuer,
      jwtid: crypto.randomUUID(),
    },
  );
};

const generateRefreshToken = (
  userId: string,
  username: string,
  sessionId: string,
): string => {
  return jwt.sign(
    {
      uid: userId,
      username: username,
      type: "ref",
      sId:sessionId
    } as TokenPayload,
    config.refresh.secret,
    {
      expiresIn: config.refresh.expiry,
      issuer: config.issuer,
      jwtid: crypto.randomUUID(),
    },
  );
};

const verifyAccessToken = (accessToken: string) => {};

const verifyRefreshToken = (oldRefreshToken: string) => {};

const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const saveToken = async (tokenModel: {
  sessionId: string;
  userId: string;
  token: string;
  clientInfo: ClientInfo;
}): Promise<void> => {
  await saveTokenInDb({
    sessionId: tokenModel.sessionId,
    userId: tokenModel.userId,
    tokenHash: hashToken(tokenModel.token),
    clientInfo: tokenModel.clientInfo,
    expireAt: new Date(Date.now() + config.refresh.expiry * 1000),
  });
};

export {
  saveToken,
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  TokenPayload,
};
