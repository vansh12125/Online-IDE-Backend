import passport from "passport";
import {
  Strategy as GoogleStartegy,
  Profile as GoogleProfile,
  VerifyCallback,
} from "passport-google-oauth20";
import { OAuthProvider } from "../generated/prisma/enums";
import { OAuthUser } from "../types";


const googleVerify = async (
  _accessToken: string,
  _refreshToken: string,
  profile: GoogleProfile,
  done: VerifyCallback,
) => {
  try {
    const email: string | undefined = profile.emails?.[0]?.value;
    const isVerified: boolean | undefined = profile.emails?.[0]?.verified;
    const name: string = profile.displayName;
    const avatar: string | undefined = profile.photos?.[0]?.value ?? "";
    const user: OAuthUser = {
      oAuthId: profile.id,
      email: email?.toLowerCase() ?? "",
      name: name,
      avatar: avatar,
      isVerified: isVerified ?? false,
      provider: OAuthProvider.GOOGLE,
    };

    done(null, user as any);
  } catch (error) {
    done(error, false);
  }
};

passport.use(
  new GoogleStartegy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    googleVerify,
  ),
);
