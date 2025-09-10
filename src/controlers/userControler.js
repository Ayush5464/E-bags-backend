import user from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await user.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashPassword = await bcrypt.hash(password, 10);
        await user.create({ name, email, password: hashPassword });

        res.status(201).json({ message: "User signed up successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

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

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        token,
        user: { id: User._id, name: User.name, email: User.email, isAdmin: User.isAdmin },
    });
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Logged out" });
};
