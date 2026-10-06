import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Helper function to generate an access token with user ID in payload
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || "your_secret",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};

export default generateToken;
