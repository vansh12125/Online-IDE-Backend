import { Languages } from "../generated/prisma/enums";
import { LanguagesFileContent } from "../enums";
import { exec } from "child_process";
import fs from "fs/promises";
import dirTree from "directory-tree";
import { ProjectNotFound } from "../errors";
import path from "path";

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

const getProjectTreeFromServer = async (projectId: string) => {
  const folderPath: string = `./projects/${projectId}`;

  const tree = dirTree(folderPath, {
    attributes: ["extension", "type"],
    exclude: /node_modules|\.git|dist|build|\.next/,
  });

  if (!tree) {
    throw new ProjectNotFound();
  }

  await getFileContent(tree);
  return tree;
};

const createFileInServer = async (
  projectId: string,
  filePath: string,
  content: string | undefined,
) => {
  const folderPath: string = `./projects/${projectId}`;
  const fullPath: string = path.join(folderPath, filePath);

  await fs.mkdir(path.dirname(fullPath), { recursive: true });
  await fs.writeFile(fullPath, content ?? "");
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

const getFileContent = async (file: any): Promise<void> => {
  if (file.type === "file") {
    file.content = await fs.readFile(file.path, "utf-8");
    return;
  }
  if (file.children) {
    await Promise.all(file.children.map(getFileContent));
  }
};

export {
  createProjectInServer,
  deleteProjectFromServer,
  getProjectTreeFromServer,
  createFileInServer,
};
