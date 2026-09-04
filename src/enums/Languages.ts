
export const LanguagesFileContent = {
  HTML: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="style.css" />
    <title>Document</title>
  </head>
  <body>
    <h1>Hello...</h1>
    <script src="script.js"></script>
  </body>
</html>`,
  JS: `console.log("Hello World");`,
  CSS: `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: black;
  color: white;
}
`,
  EXPRESS: `import express from "express";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});`,

  EXPRESS_PACKAGE_JSON: `{
  "name": "express-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^5.1.0"
  }
}`,
};