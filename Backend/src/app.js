import express from "express";
import authRoutes from "./routes/auth.routes.js";
import morgan from "morgan"
import chatRoutes from "./routes/chat.routes.js";
import cookieParser from "cookie-parser"
const app = express();

// Parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan("dev"))

app.use("/api/auth", authRoutes);
app.use("/api/chat" , chatRoutes)

// Simple health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running smoothly" });
});

export default app;
