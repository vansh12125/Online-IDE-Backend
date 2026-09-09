import { prisma } from "../config/prisma.config";
import { OAuthProvider } from "../generated/prisma/enums";

const findExistingByOauth = async (
  provider: OAuthProvider,
  oAuthId: string,
) => {
  return await prisma.oAuthAccount.findFirst({
    where: {
      AND: [{ provider: provider }, { providerAccountId: oAuthId }],
    },
    include: {
      user: true,
    },
  });
};

const linkOauthAccount = async (
  userId: string,
  provider: OAuthProvider,
  providerAccountId: string,
) => {
  return await prisma.oAuthAccount.create({
    data: {
      userId: userId,
      provider: provider,
      providerAccountId: providerAccountId,
    },
  });
};

export { findExistingByOauth,linkOauthAccount };
