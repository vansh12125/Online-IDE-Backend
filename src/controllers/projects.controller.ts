import type { Request, Response } from "express";
import User, { Project, CreateProjectRequest } from "../types";
import { findExistingUserByUserId } from "../repositories/user.repository";
import { UserNotFound, InvalidCredentials, ProjectNotFound } from "../errors";
import { DataResponse, ErrorResponse } from "../utils";
import { Languages } from "../generated/prisma/enums";
import {
  createProjectInServer,
  deleteProjectFromServer,
  getProjectTreeFromServer,
  createFileInServer,
  updateFileInServer,
  deleteFileInServer,
  renameFileInServer
} from "../services/projects.service";
import {
  SaveProjectInDb,
  deleteProjectFromDb,
  getAllProjectsOfUserFromDb,
  getProjectByIdFromDb,
} from "../repositories/project.repository";

//Create Project
const createProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }

    const projectName: string = req.body.projectName.trim();
    const language: string = req.body.language;

    const projectData = await SaveProjectInDb({
      userId: req.user.uId,
      name: projectName,
      language: language,
    } as CreateProjectRequest);

    try {
      await createProjectInServer(projectData.id, language);
    } catch (error) {
      await deleteProjectFromDb(projectData.id);
      throw error;
    }

    res.status(201).json({
      status: 201,
      message: "Project Created",
      data: {
        id: projectData.id,
        language: projectData.language,
        name: projectData.name,
      } as Project,
    } as DataResponse);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Get All Projects by user
const getAllProjectsOfUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }

    const allProjects = await getAllProjectsOfUserFromDb(req.user.uId);

    return res.status(200).json({
      status: 200,
      message: `${allProjects.length} Projects Found`,
      data: allProjects,
    } as DataResponse);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Get Project By Id
const getProjectById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }

    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    return res.status(200).json({
      status: 200,
      message: "Project found",
      data: project,
    } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.send(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Delete Project By Id
const deleteProject = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    await deleteProjectFromServer(projectId);
    await deleteProjectFromDb(projectId);

    return res.status(200).json({
      status: 200,
      message: "Project deleted successfully",
    } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.send(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Get Project Tree
const getProjectTree = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    const data = await getProjectTreeFromServer(project.id);

    return res.status(200).json({
      status: 200,
      message: "Project Structure",
      data: data,
    } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Create File
const createFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    const path: string = req.body.path.trim();
    const content: string | undefined = req.body.content;

    await createFileInServer(project.id, path, content);

    return res
      .status(201)
      .json({ status: 201, message: "File created" } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Update File
const updateFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    const path: string = req.body.path.trim();
    const content: string = req.body.content;

    await updateFileInServer(project.id, path, content);

    return res
      .status(200)
      .json({ status: 200, message: "File content saved" } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

//Delete File
const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }
    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    const path: string = req.body.path.trim();

    await deleteFileInServer(project.id,path);

    return res.status(200).json({
      status:200,
      message:"File deleted successfully"
    } as DataResponse)

  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

// Rename File/Folder
const renameFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 401,
        message: "Authentication Required",
        errors: "Authentication Required",
      } as ErrorResponse);
    }

    const projectId = req.params.projectId;

    if (typeof projectId !== "string") {
      throw new Error("Invalid project id");
    }

    const project: Project | null = await getProjectByIdFromDb(
      projectId,
      req.user.uId,
    );

    if (!project) {
      throw new ProjectNotFound();
    }

    const oldPath: string = req.body.oldPath.trim();
    const newPath: string = req.body.newPath.trim();

    await renameFileInServer(project.id, oldPath, newPath);

    return res.status(200).json({
      status: 200,
      message: "File or folder renamed successfully",
    } as DataResponse);
  } catch (error) {
    if (error instanceof ProjectNotFound) {
      return res.status(404).json({
        status: 404,
        message: "Project not found",
        errors: "Project not found",
      } as ErrorResponse);
    } else if (error instanceof Error) {
      return res.status(400).json({
        status: 400,
        message: error.message,
        errors: error.message,
      } as ErrorResponse);
    } else {
      return res.status(500).json({
        status: 500,
        message: "Some Error Occured",
        errors: "Internal server error",
      } as ErrorResponse);
    }
  }
};

export {
  createProject,
  getAllProjectsOfUser,
  getProjectById,
  deleteProject,
  getProjectTree,
  createFile,
  updateFile,
  deleteFile,
  renameFile
};
