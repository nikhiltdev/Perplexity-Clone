import express from "express";
import {
  registerUser,
  loginUser,
  getMeUser,
} from "../controllers/auth.controller.js";
import { userMiddleware } from "../middleware/user.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route (requires valid access token)
router.get("/me", userMiddleware, getMeUser);

export default router;
