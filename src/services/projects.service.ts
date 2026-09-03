import { Languages } from "../enums";
import { exec } from "child_process";
import fs from "fs/promises";

const createProjectInServer = async (projectId: string, language: string) => {
  await fs.mkdir("./projects", { recursive: true });

  if (language === Languages.HTML) {
  } else if (language === Languages.EXPRESS) {
  } else if (language === Languages.NEXT) {
  } else if (language === Languages.REACT) {
    await executeComamnd(
      `npm create vite@latest ${projectId} -- --template react`,
    );
  } else {
    throw new Error("Invalid language");
  }
};

const executeComamnd = async (cmd: string) => {
  await new Promise<void>((resolve, reject) => {
    exec(cmd, { cwd: "./projects" }, (error, stdout, stderr) => {
      if (error) {
        console.error(stderr);
        reject(error);
        return;
      }

      console.log(stdout);
      resolve();
    });
  });
};

export { createProjectInServer };
