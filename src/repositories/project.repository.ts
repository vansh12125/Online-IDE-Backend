import { prisma } from "../config/prisma.config";
import { Project, CreateProjectRequest } from "../types";

const SaveProjectInDb = async (createRequest: CreateProjectRequest) => {
  return await prisma.project.create({
    data: {
      name: createRequest.name,
      language: createRequest.language,
      userId: createRequest.userId,
    },
    select: {
      id: true,
      language: true,
      name: true,
    },
  });
};

const deleteProjectFromDb = async (projectId: string) => {
  await prisma.project.delete({
    where: { id: projectId },
  });
};

const getAllProjectsOfUserFromDb = async (userId: string) => {
  return await prisma.project.findMany({
    where: { userId: userId },
    select: {
      id: true,
      createdAt: true,
      updatedAt: true,
      language: true,
      name: true,
    },
  });
};

const getProjectByIdFromDb = async (projectId: string, userId: string) => {
  return await prisma.project.findFirst({
    where: { AND: [{ id: projectId }, { userId: userId }] },
  });
};

export {
  SaveProjectInDb,
  deleteProjectFromDb,
  getAllProjectsOfUserFromDb,
  getProjectByIdFromDb,
};
