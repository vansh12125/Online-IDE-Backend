import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

interface TokenPayload extends JwtPayload {
  uid: string;
  username: string;
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

const generateAccessToken = (userId: string, username: string): string => {
  return jwt.sign(
    {
      uid: userId,
      username: username,
      type: "acc",
    } as TokenPayload,
    config.access.secret,
    {
      expiresIn: config.access.expiry,
      issuer: config.issuer,
      jwtid: crypto.randomUUID(),
    },
  );
};

const generateRefreshToken = (userId: string, username: string): string => {
  return jwt.sign(
    {
      uid: userId,
      username: username,
      type: "ref",
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

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  TokenPayload,
};
