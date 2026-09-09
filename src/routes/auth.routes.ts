import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import {
  registerUserValidation,
  loginUserValidation,
  deleteUserValidation,
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
  loginOauthUser,
} from "../controllers/auth.controller";
import authenticate from "../middleware/jwt-auth.middleware";
import passport from "passport";
import { ErrorResponse } from "../utils";
import { OAuthUser } from "../types";
import { OAuthProvider } from "../generated/prisma/enums";

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
authRoutes.post("/refresh", (req: Request, res: Response) => {
  return rotateRefreshToken(req, res);
});

//Get Profile
authRoutes.get("/me", authenticate, (req: Request, res: Response) => {
  return getUserProfile(req, res);
});

//Delete Profile
authRoutes.delete(
  "/delete",
  authenticate,
  deleteUserValidation,
  (req: Request, res: Response) => {
    return deleteProfile(req, res);
  },
);

//Update Profile
authRoutes.patch("/me", authenticate, (req: Request, res: Response) => {
  return updateProfile(req, res);
});

//Login With Google
authRoutes.get(
  "/signin/google",
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })(req, res, next);
  },
);

//Google Callback
authRoutes.get(
  "/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      async (err: Error | null, googleUser: any, _info?: unknown) => {
        if (err) {
          return res.status(500).json({
            status: 500,
            message: "Google authentication failed",
            errors: "Google authentication failed",
          } as ErrorResponse);
        }
        if (!googleUser) {
          return res.status(401).json({
            status: 401,
            message: "Google authentication failed",
            errors: "Google authentication failed",
          } as ErrorResponse);
        }
        

        const oAuthUser: OAuthUser = {
          oAuthId: googleUser.oAuthId,
          email: googleUser.email,
          name: googleUser.name,
          isVerified: googleUser.isVerified,
          provider: OAuthProvider.GOOGLE,
          avatar: googleUser.avatar,
        };

        loginOauthUser(req, res, oAuthUser);
      },
    )(req, res, next);
  },
);

export default authRoutes;
