import type { Request, Response, CookieOptions } from "express";
import User from "../types";
import {
  createUser,
  findExistingUserByUsernameOrEmail,
  findExistingUserByEmail,
  findUserForLogin,
  findExistingUserByUsername,
} from "../repositories/user.repository";
import {
  EmailAlreadyExist,
  UserNotFound,
  UsernameAlreadyExist,
  InvalidCredentials,
} from "../errors";
import { DataResponse, ErrorResponse } from "../utils";
import { hashPassword, verifyPassword } from "../services/bcrypt.service";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../services/jwt-auth.service";

//constants
const toBoolean = (val: any) => val === "true";
const accessCookieName: string = String(process.env.ACCESS_TOKEN_COOKIE_NAME);
const refreshCookieName: string = String(process.env.REFRESH_TOKEN_COOKIE_NAME);
const frontEndUrl: string = String(process.env.FRONTEND_URL);

const toSameSite = (val: string | undefined): CookieOptions["sameSite"] => {
  if (val === "lax" || val === "strict" || val === "none") {
    return val;
  }

  return undefined;
};

const accessCookieConfig: CookieOptions = {
  secure: toBoolean(process.env.JWT_TOKEN_COOKIE_SECURE),
  httpOnly: toBoolean(process.env.JWT_TOKEN_COOKIE_HTTP_ONLY),
  sameSite: toSameSite(process.env.JWT_TOKEN_COOKIE_SAME_SITE),
  maxAge: Number(process.env.ACCESS_COOKIE_MAX_AGE),
};

const refreshCookieConfig: CookieOptions = {
  secure: toBoolean(process.env.JWT_TOKEN_COOKIE_SECURE),
  httpOnly: toBoolean(process.env.JWT_TOKEN_COOKIE_HTTP_ONLY),
  sameSite: toSameSite(process.env.JWT_TOKEN_COOKIE_SAME_SITE),
  maxAge: Number(process.env.REFRESH_COOKIE_MAX_AGE),
};

//Register user
const registerUser = async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username.toLowerCase();
    const email: string = req.body.email.toLowerCase();
    const name: string = req.body.name;
    const password: string = req.body.password;

    const existing: User | null = await findExistingUserByUsernameOrEmail(
      username,
      email,
    );

    if (existing) {
      if (existing.username === username) {
        throw new UsernameAlreadyExist();
      }
      throw new EmailAlreadyExist();
    }

    const user: User = await createUser({
      username,
      email,
      name,
      password: await hashPassword(password),
    });

    return res.status(201).json({
      status: 201,
      message: "User created successfully",
      data: user,
    } as DataResponse);
  } catch (error) {
    if (error instanceof UsernameAlreadyExist) {
      return res.status(409).json({
        status: 409,
        message: error.message,
        errors: "Username already exists",
      } as ErrorResponse);
    } else if (error instanceof EmailAlreadyExist) {
      return res.status(409).json({
        status: 409,
        message: error.message,
        errors: "Email already exists",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Login user
const loginUser = async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username.toLowerCase();
    const password: string = req.body.password;

    const existing = await findUserForLogin(username);

    if (!existing) {
      throw new UserNotFound();
    }

    const verified: boolean = await verifyPassword(password, existing.password);

    if (!verified) {
      throw new InvalidCredentials();
    }
    const accessToken: string = generateAccessToken(
      existing.id,
      existing.username,
    );
    const refreshToken: string = generateRefreshToken(
      existing.id,
      existing.username,
    );

    res.cookie(accessCookieName, accessToken, accessCookieConfig);
    res.cookie(refreshCookieName, refreshToken, refreshCookieConfig);

    return res.status(200).json({
      status: 200,
      message: "Login Success",
    } as DataResponse);
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      return res.status(401).json({
        status: 401,
        message: "Invalid username or password",
        errors: "Invalid username or password",
      } as ErrorResponse);
    } else if (error instanceof UserNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Invalid username or password",
        errors: "Invalid username or password",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Get user profile
const getUserProfile = (req: Request, res: Response) => {};

//update profile
const updateProfile = (req: Request, res: Response) => {};

//delete profile
const deleteProfile = (req: Request, res: Response) => {};

export {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  deleteProfile,
};
