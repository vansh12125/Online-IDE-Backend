import { prisma } from "../config/prisma.config";

import type { CreateRefreshToken, RefreshToken } from "../types";

const saveTokenInDb = async (tokenModel: CreateRefreshToken): Promise<void> => {
  await prisma.refreshToken.create({
    data: {
      tokenHash: tokenModel.tokenHash,
      sessionId: tokenModel.sessionId,
      expireAt: tokenModel.expireAt,
      userId: tokenModel.userId,

      clientInfo: {
        create: {
          ipAddress: tokenModel.clientInfo.ipAddress,
          browser: tokenModel.clientInfo.browser,
          browserVersion: tokenModel.clientInfo.browserVersion,
          os: tokenModel.clientInfo.os,
          osVersion: tokenModel.clientInfo.osVersion,
          device: tokenModel.clientInfo.device,
        },
      },
    },
  });
};

const findTokenBySessionIdAndNotRevoked = async (
  sessionId: string,
): Promise<RefreshToken | null> => {
  return await prisma.refreshToken.findFirst({
    where: {
      sessionId,
      revoked: false,
    },
  });
};

const findTokenAndRevoke = async (
  tokenHash: string,
  sessionId: string,
): Promise<boolean> => {
  const result = await prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      sessionId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  return result.count > 0;
};

export { saveTokenInDb, findTokenBySessionIdAndNotRevoked ,findTokenAndRevoke};
