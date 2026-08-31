import "dotenv/config";
import app from "./app";

const PORT: number = Number(process.env.SERVER_PORT) || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
