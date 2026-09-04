import { Router } from "express";
import type { Request, Response } from "express";
import authenticate from "../middleware/jwt-auth.middleware";
import {
  createProject,
  getAllProjectsOfUser,
  deleteProject,
  getProjectById,
  getProjectTree,
  createFile,
  updateFile,
  deleteFile,
  renameFile
} from "../controllers/projects.controller";
import {
  createProjectValidation,
  createFileValidation,
  updateFileValidation,
  deleteFileValidation,
  renameFileValidation
} from "../middleware/validation.middleware";

const projectRoutes: Router = Router();

//Create Project
projectRoutes.post(
  "/",
  authenticate,
  createProjectValidation,
  (req: Request, res: Response) => {
    createProject(req, res);
  },
);

//Get All Projects by user
projectRoutes.get("/", authenticate, (req: Request, res: Response) => {
  getAllProjectsOfUser(req, res);
});

//Get Project By Id
projectRoutes.get(
  "/:projectId",
  authenticate,
  (req: Request, res: Response) => {
    getProjectById(req, res);
  },
);

//Delete Project By Id
projectRoutes.delete(
  "/:projectId",
  authenticate,
  (req: Request, res: Response) => {
    deleteProject(req, res);
  },
);

//Get Project Tree
projectRoutes.get(
  "/:projectId/files",
  authenticate,
  (req: Request, res: Response) => {
    getProjectTree(req, res);
  },
);

//Create File in project
projectRoutes.post(
  "/:projectId/files",
  authenticate,
  createFileValidation,
  (req: Request, res: Response) => {
    createFile(req, res);
  },
);

//Update File in project
projectRoutes.patch(
  "/:projectId/files",
  authenticate,
  updateFileValidation,
  (req: Request, res: Response) => {
    updateFile(req, res);
  },
);

//Delete File in project
projectRoutes.delete(
  "/:projectId/files",
  authenticate,
  deleteFileValidation,
  (req: Request, res: Response) => {
    deleteFile(req, res);
  },
);

//Rename File/Folder in project
projectRoutes.patch(
  "/:projectId/files/rename",
  authenticate,
  renameFileValidation,
  (req: Request, res: Response) => {
    renameFile(req, res);
  },
);

export default projectRoutes;
