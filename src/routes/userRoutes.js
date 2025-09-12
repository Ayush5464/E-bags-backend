// routes/userRouter.js
import express from "express";
import { logoutUser, userLogin, userSignup } from "../controlers/userControler.js";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";

const userRouter = express.Router();

// Public routes
userRouter.post("/signup", userSignup);
userRouter.post("/login", userLogin);
userRouter.post("/logout", logoutUser);

// Protected route to fetch current user
userRouter.get("/me", protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default userRouter;
