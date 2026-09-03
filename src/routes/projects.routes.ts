import { Router } from "express";
import type { Request, Response } from "express";
import authenticate from "../middleware/jwt-auth.middleware";
import {
  createProject,
  getAllProjectsOfUser,
  deleteProject,
  getProjectById,
} from "../controllers/projects.controller";
import {createProjectValidation} from "../middleware/validation.middleware"

const projectRoutes: Router = Router();

//Create Project
projectRoutes.post("/", authenticate,createProjectValidation, (req: Request, res: Response) => {
  createProject(req, res);
});

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

export default projectRoutes;
