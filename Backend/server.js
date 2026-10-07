import dotenv from "dotenv";
import app from "./src/app.js";
import { createServer } from "http"
import { initServer } from "./src/sockets/server.socket.js"
import { connectionDB } from "./src/config/db.js";
// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    connectionDB();
    const httpServer = createServer(app)
    initServer(httpServer)
    httpServer.listen(process.env.PORT, () => {
      console.log(` Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.error(" Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

startServer();
