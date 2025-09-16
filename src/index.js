import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";

import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import cartRouter from "./routes/cartRouter.js";
import adminRouter from "./routes/adminRouter.js";
import { upload } from "./middleware/uploads.js";

dotenv.config();

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

// Ensure uploads folder exists
// const uploadPath = path.resolve("uploads");
// if (!fs.existsSync(uploadPath)) {
//     fs.mkdirSync(uploadPath, { recursive: true });
// }

// Serve uploads folder statically
app.use("/uploads", express.static(upload));

// API routes
app.use("/ebagmart/auth", userRouter);
app.use("/ebagmart/products", productRouter);
app.use("/ebagmart/orders", orderRouter);
app.use("/ebagmart/cart", cartRouter);
app.use("/ebagmart/admin", adminRouter);

// Test route
app.get("/", (req, res) => res.send("Backend is running!"));

// Start server
const PORT = process.env.PORT || 5000;
ConnectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch((err) => console.error("❌ DB connection failed:", err));
