import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const publicRoutes = ["/auth/login", "/auth/register"];

export const authMiddleware = asyncHandler(async (req, res, next) => {
  if (publicRoutes.includes(req.path)) {
    return next();
  }
  const [type, token] = req.headers.authorization?.split(" ") || [];
  if (!token || type !== "Bearer") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});
