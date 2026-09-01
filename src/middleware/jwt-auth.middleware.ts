import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/jwt-auth.service";
import { ErrorResponse } from "../utils";
import jwt from "jsonwebtoken";
import { InvalidTokenError } from "../errors";

const accessCookieName: string = String(process.env.ACCESS_TOKEN_COOKIE_NAME);
const refreshCookieName: string = String(process.env.REFRESH_TOKEN_COOKIE_NAME);

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken: string | undefined | null =
      req.cookies[accessCookieName];

    if (!accessToken) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }

    const decoded = await verifyAccessToken(accessToken);
    req.user = {
      uId: decoded.uid,
      username: decoded.username,
      sId: decoded.sId,
    };
    next();
  } catch (error) {
    res.clearCookie(accessCookieName);
    res.clearCookie(refreshCookieName);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        status: 401,
        message: "Access token expired",
        errors: "Access token expired",
      } as ErrorResponse);
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        status: 401,
        message: "Invalid access token",
        errors: "Invalid access token",
      } as ErrorResponse);
    }

    if (error instanceof InvalidTokenError) {
      return res.status(401).json({
        status: 401,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    }

    return res.status(500).json({
      status: 500,
      message: "Authentication service error",
      errors: error,
    } as ErrorResponse);
  }
};

export default authenticate;
