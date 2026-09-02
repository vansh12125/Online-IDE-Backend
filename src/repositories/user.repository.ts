import { prisma } from "../config/prisma.config";
import User from "../types";

const createUser = async (userData: {
  username: string;
  name: string;
  email: string;
  password: string;
}): Promise<void> => {
  await prisma.user.create({
    data: {
      email: userData.email,
      name: userData.name,
      username: userData.username,
      password: userData.password,
    },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const findExistingUserByUsernameOrEmail = async (
  username: string,
  email: string,
): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });
};

const findExistingUserByUsername = async (
  username: string,
): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { username },
  });
};

const findExistingUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findFirst({
    where: { email },
  });
};

const findUserForLogin = async (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });
};

const findExistingUserByUserId = async (userId: string) => {
  return await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const findExistingUserForDeleteAccount = async (userId: string) => {
  return await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      password: true,
    },
  });
};

const findAndDeleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

export {
  createUser,
  findExistingUserByUsernameOrEmail,
  findExistingUserByEmail,
  findExistingUserByUsername,
  findUserForLogin,
  findExistingUserByUserId,
  findExistingUserForDeleteAccount,
  findAndDeleteUser
};
