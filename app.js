import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "url";
import routes from "./routes/users.js";
import { createServer } from "http";
import { connectionDB } from "./utils/dbConnection.js";
import { StatusCodes } from "http-status-codes";
import { setupSocketServer } from "./controllers/socketserver.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Accessing the public folder
app.use(express.static(path.join(__dirname, "public")));

// Create an HTTP server and pass it to Socket.IO
const httpServer = createServer(app);
setupSocketServer(httpServer);

// db connection
connectionDB();

// index route
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3331;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

export default app;
