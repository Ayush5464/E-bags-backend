import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel.js"; // import your user model

dotenv.config();

export const protect = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; //  full user attached
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
