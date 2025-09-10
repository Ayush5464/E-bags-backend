import express from "express"
import user from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

export const userSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        const existing = user.findOne({ email })

        if (!existing) return res.status(400).json({ message: "user already exisit" });

        const hashPassword = await bcrypt.hash(password, 10);

        const User = user.create({
            name,
            email,
            password: hashPassword,
        }).then(() => {
            res.status(200).json({ message: "User signed Up successfully" })
        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: "internal server error" })

    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;

    // ✅ Defensive check
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const User = await user.findOne({ email });

    if (!User) {
        return res.status(404).json({ message: "User not found" });
    }

    if (!User.password) {
        return res.status(500).json({ message: "Password not set for user" });
    }

    const isMatch = await bcrypt.compare(password, User.password); // 💥 error was here

    if (!isMatch) {
        return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: User._id, isAdmin: User.isAdmin, }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // ✅ false for localhost, true in production (HTTPS)
        sameSite: "strict", // or "strict" if CSRF protection is critical
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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
export const logoutUser = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out" });
};
