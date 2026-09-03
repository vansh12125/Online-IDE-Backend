import type { Request, Response } from "express";
import User from "../types";
import { findExistingUserByUserId } from "../repositories/user.repository";
import { UserNotFound, InvalidCredentials } from "../errors";
import { DataResponse, ErrorResponse } from "../utils";
import { Languages } from "../enums";
import { createProjectInServer } from "../services/projects.service";

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

    await createProjectInServer(projectName, language);

    res
      .status(201)
      .json({
        status: 201,
        message: "Project Created",
        data: language,
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
  } catch (error) {}
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
  } catch (error) {}
};

export { createProject, getAllProjectsOfUser, getProjectById, deleteProject };
