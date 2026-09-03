import { Languages } from "../enums";

interface CreateProjectReques {
  name: string;
  language: Languages;
}

interface Project {
  id: string;
  userId: string;
  name: string;
  language: Languages;
  createdAt: Date;
  updatedAt: Date;
}

export type { CreateProjectReques, Project };
