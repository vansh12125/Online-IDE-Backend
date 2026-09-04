import { Languages } from "../generated/prisma/enums";
import { LanguagesFileContent } from "../enums";
import { exec } from "child_process";
import fs from "fs/promises";

const createProjectInServer = async (projectId: string, language: string) => {
  await fs.mkdir("./projects", { recursive: true });
  const folderPath: string = `./projects/${projectId}`;

  if (language === Languages.HTML) {
    await fs.mkdir(folderPath, { recursive: true });
    //Html
    await fs.writeFile(`${folderPath}/index.html`, LanguagesFileContent.HTML);
    //Css
    await fs.writeFile(`${folderPath}/style.css`, LanguagesFileContent.CSS);
    //Js
    await fs.writeFile(`${folderPath}/script.js`, LanguagesFileContent.JS);
  } else if (language === Languages.EXPRESS) {
    await fs.mkdir(`${folderPath}/src`, { recursive: true });

    await fs.writeFile(
      `${folderPath}/src/index.js`,
      LanguagesFileContent.EXPRESS,
    );

    await fs.writeFile(
      `${folderPath}/package.json`,
      LanguagesFileContent.EXPRESS_PACKAGE_JSON,
    );
  } else if (language === Languages.REACT) {
    await executeComamnd(
      `npm create vite@latest ${projectId} -- --template react`,
    );
  } else {
    throw new Error("Invalid language");
  }
};

const deleteProjectFromServer = async (projectId: string) => {
  const folderPath: string = `./projects/${projectId}`;

  await fs.rm(folderPath, {
    recursive: true,
    force: false,
  });
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

export { createProjectInServer,deleteProjectFromServer };
