// controllers/userController.js

import user from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register User
export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await user.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await user.create({ name, email, password: hashPassword });

        res.status(201).json({ message: "User signed up successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Login User
export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    const User = await user.findOne({ email });
    if (!User) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, User.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
        { id: User._id, isAdmin: User.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    // ✅ No need to set cookie — frontend uses localStorage
    res.status(200).json({
        token,
        user: {
            id: User._id,
            name: User.name,
            email: User.email,
            isAdmin: User.isAdmin,
        },
    });
};

// Logout User
export const logoutUser = (req, res) => {
    // Optional, since token is stored in localStorage on frontend
    res.status(200).json({ message: "Logged out" });
};
