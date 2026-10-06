import jwt from "jsonwebtoken"


export const userMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    console.log(token)
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decode = jwt.verify(token , process.env.JWT_SECRET)
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid Token" })  
  }
}