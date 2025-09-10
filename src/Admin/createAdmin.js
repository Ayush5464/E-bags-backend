import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import user from "../models/userModel.js";

dotenv.config();

export const createAdmin = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await user.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
    });

    console.log("✅ Admin created:", admin.email);
    mongoose.disconnect();
};


