import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import cartRouter from "./routes/cartRouter.js";
import adminRouter from "./routes/adminRouter.js";

import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

const app = express();

// Middlewares
app.use(cookieParser());
app.use(express.json());

// CORS
app.use(
    cors({
        origin: "https://e-bags-frontend.vercel.app",
        credentials: true,
    })
);

// Serve static /uploads folder
const uploadsPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsPath)) fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath));

// API Routes
app.use("/ebagmart/auth", userRouter);
app.use("/ebagmart/products", productRouter);
app.use("/ebagmart/orders", orderRouter);
app.use("/ebagmart/cart", cartRouter);
app.use("/ebagmart/admin", adminRouter);

// Optional test route
app.get("/", (req, res) => res.send("Backend is running!"));

// Start server
const PORT = process.env.PORT || 5000;
ConnectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ DB connection failed:", err));
