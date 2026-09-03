import { Router } from "express";
import authRoutes from "./auth.routes.ts";
import projectRoutes from "./projects.routes.ts";

const routes: Router = Router();

routes.use("/auth", authRoutes);
routes.use("/projects", projectRoutes);

export default routes;
