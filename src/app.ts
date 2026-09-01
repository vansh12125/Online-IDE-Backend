import express from "express";
import type { Express } from "express";
import routes from "./routes";

const app: Express = express();
const version: string = process.env.API_VERSION || "v1";

app.use(express.json());
app.use(`/api/${version}`, routes);

export default app;
