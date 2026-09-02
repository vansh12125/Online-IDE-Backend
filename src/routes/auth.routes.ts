import { Router } from "express";
import type { Request, Response } from "express";
import {
  registerUserValidation,
  loginUserValidation,
} from "../middleware/validation.middleware";
import {
  registerUser,
  loginUser,
  deleteProfile,
  getUserProfile,
  updateProfile,
  logoutUser,
  logoutUserAllSession,
  rotateRefreshToken,
} from "../controllers/auth.controller";
import authenticate from "../middleware/jwt-auth.middleware";

const authRoutes: Router = Router();

//Register User
authRoutes.post(
  "/signup",
  registerUserValidation,
  (req: Request, res: Response) => {
    return registerUser(req, res);
  },
);

//Login User
authRoutes.post(
  "/signin",
  loginUserValidation,
  (req: Request, res: Response) => {
    return loginUser(req, res);
  },
);

//Logout User
authRoutes.get("/signout", authenticate, (req: Request, res: Response) => {
  return logoutUser(req, res);
});

//Logout User All Sessions
authRoutes.get("/signout/all", authenticate, (req: Request, res: Response) => {
  return logoutUserAllSession(req, res);
});

//Rotate Refresh Token
authRoutes.post("/refresh", authenticate, (req: Request, res: Response) => {
  return rotateRefreshToken(req, res);
});

//Get Profile
authRoutes.get("/me", authenticate, (req: Request, res: Response) => {
  return getUserProfile(req, res);
});

//Delete Profile
authRoutes.delete("/me", authenticate, (req: Request, res: Response) => {
  return deleteProfile(req, res);
});

//Update Profile
authRoutes.patch("/me", authenticate, (req: Request, res: Response) => {
  return updateProfile(req, res);
});

export default authRoutes;
