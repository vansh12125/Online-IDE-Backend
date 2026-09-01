import { prisma } from "../config/prisma.config";

import type { CreateRefreshToken } from "../types";

const saveTokenInDb = async (
  tokenModel: CreateRefreshToken,
): Promise<void> => {
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

export { saveTokenInDb };