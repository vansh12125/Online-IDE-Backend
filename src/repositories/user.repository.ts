import { prisma } from "../config/prisma.config";
import User from "../types";

const createUser = async (userData: {
  username: string;
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  return await prisma.user.create({
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
      id:true,
      username: true,
      password: true,
    },
  });
};

export {
  createUser,
  findExistingUserByUsernameOrEmail,
  findExistingUserByEmail,
  findExistingUserByUsername,
  findUserForLogin,
};
