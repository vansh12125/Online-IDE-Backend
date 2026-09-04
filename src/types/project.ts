import { Languages } from "../generated/prisma/enums";

interface CreateProjectRequest {
  name: string;
  language: Languages;
  userId:string;
}

interface Project {
  id: string;
  userId: string;
  name: string;
  language: Languages;
  createdAt: Date;
  updatedAt: Date;
}

export type { CreateProjectRequest, Project };
