import type { Request, Response } from "express";
import User from "../types";
import {
  createUser,
  findExistingUserByUsernameOrEmail,
} from "../repositories/user.repository";
import {
  EmailAlreadyExist,
  UserNotFound,
  UsernameAlreadyExist,
} from "../errors";
import { DataResponse, ErrorResponse } from "../utils";
import { hashPassword } from "../services/bcrypt.service";

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
const loginUser = (req: Request, res: Response) => {};

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
