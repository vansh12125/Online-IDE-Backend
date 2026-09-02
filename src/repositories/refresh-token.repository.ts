import { prisma } from "../config/prisma.config";

import type { CreateRefreshToken, RefreshToken } from "../types";

const saveTokenInDb = async (tokenModel: CreateRefreshToken): Promise<void> => {
  await prisma.refreshToken.create({
    data: {
      tokenHash: tokenModel.tokenHash,
      sessionId: tokenModel.sessionId,
      expireAt: tokenModel.expireAt,
      userId: tokenModel.userId,
      revoked:false,
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

const findTokenUsingHashAndSessionAndRevokeIt = async (
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

const findTokenBySessionIdAndMarkRevoked = async (
  sessionId: string,
): Promise<boolean> => {
  const result = await prisma.refreshToken.updateMany({
    where: {
      sessionId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  return result.count > 0;
};

const findAllTokenByUserIdAndMarkAllRevoked = async (
  userId: string,
): Promise<boolean> => {
  const result = await prisma.refreshToken.updateMany({
    where: {
      userId,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });

  return result.count > 0;
};

export {
  saveTokenInDb,
  findTokenBySessionIdAndNotRevoked,
  findTokenUsingHashAndSessionAndRevokeIt,
  findTokenBySessionIdAndMarkRevoked,
  findAllTokenByUserIdAndMarkAllRevoked,
};
