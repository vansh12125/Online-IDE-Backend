import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import {
  saveTokenInDb,
  findTokenBySessionIdAndNotRevoked,
  findTokenAndRevoke,
} from "../repositories/refresh-token.repository";
import { ClientInfo, RefreshToken } from "../types";
import { InvalidTokenError } from "../errors";

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
      sId: sessionId,
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
      sId: sessionId,
    } as TokenPayload,
    config.refresh.secret,
    {
      expiresIn: config.refresh.expiry,
      issuer: config.issuer,
      jwtid: crypto.randomUUID(),
    },
  );
};

const verifyAccessToken = async (
  accessToken: string,
): Promise<TokenPayload> => {
  try {
    const decoded = jwt.verify(accessToken, config.access.secret, {
      issuer: config.issuer,
    });

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof decoded.uid !== "string" ||
      typeof decoded.sId !== "string" ||
      typeof decoded.username !== "string" ||
      decoded.type !== "acc"
    ) {
      throw new InvalidTokenError("Invalid access token");
    }

    const refreshToken: RefreshToken | null =
      await findTokenBySessionIdAndNotRevoked(decoded.sId);

    if (!refreshToken) {
      throw new InvalidTokenError("Session has been revoked");
    }

    return decoded as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw error;
    }

    if (error instanceof InvalidTokenError) {
      throw error;
    }

    throw new InvalidTokenError("Invalid access token");
  }
};

const verifyRefreshToken = async (oldRefreshToken: string) => {
  const decoded = jwt.verify(oldRefreshToken, config.refresh.secret, {
    issuer: config.issuer,
  });

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.uid !== "string" ||
    typeof decoded.sId !== "string" ||
    typeof decoded.username !== "string" ||
    decoded.type !== "ref"
  ) {
    throw new InvalidTokenError("Invalid refresh token");
  }

  const oldPayload: TokenPayload = decoded as TokenPayload;
  const sessionId: string = oldPayload.sId;
  const oldHash: string = hashToken(oldRefreshToken);

  const oldData: boolean = await findTokenAndRevoke(oldHash, sessionId);

  if (!oldData) {
    throw new InvalidTokenError("Invalid refresh token");
  }

  return oldPayload;
};

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
