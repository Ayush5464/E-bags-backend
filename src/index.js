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

// ✅ CORS setup for all Vercel preview URLs + localhost
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow Postman/curl
            if (/\.vercel\.app$/.test(origin)) return callback(null, true); // allow any Vercel frontend
            if (/localhost/.test(origin)) return callback(null, true); // allow localhost dev
            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true, // allow cookies
    })
);

// ✅ Serve static /uploads folder
const uploadsPath = path.join(path.resolve(), "uploads");
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath));

// ✅ API Routes
app.use("/ebagmart/auth", userRouter);
app.use("/ebagmart/products", productRouter);
app.use("/ebagmart/orders", orderRouter);
app.use("/ebagmart/cart", cartRouter);
app.use("/ebagmart/admin", adminRouter);

// Optional route check
app.get("/ebagmart/auth", (req, res) => {
    res.send("Auth route is working!");
});

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// ✅ DB connect + server start
const PORT = process.env.PORT || 5000;
ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ DB connection failed:", err);
    });
