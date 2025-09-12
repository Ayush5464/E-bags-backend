import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashPassword });

        res.status(201).json({ message: "User signed up successfully" });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.status(200).json({
        token,
        user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
    });
};

export const logoutUser = (req, res) => {
    res.clearCookie("token", { httpOnly: true });
    res.status(200).json({ message: "Logged out" });
};
