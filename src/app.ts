import express from "express";
import type { Express } from "express";
import routes from "./routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import "./config/passport"
import passport from "passport";

const app: Express = express();
const version: string = process.env.API_VERSION || "v1";
const FRONTEND_URL: string =
  process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(`/api/${version}`, routes);

export default app;
