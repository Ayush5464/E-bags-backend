import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import ConnectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRoute from "./routes/productRouter.js";
import orderRouter from "./routes/orderRouter.js";
import cartRouter from "./routes/cartRouter.js";
import adminRouter from "./routes/adminRouter.js";
import cookieParser from "cookie-parser";

const app = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS setup for Vercel frontend
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true,
    })
);

// Serve static uploads
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/ebagmart/auth", userRouter);
app.use("/ebagmart/products", productRoute);
app.use("/ebagmart/orders", orderRouter);
app.use("/ebagmart/cart", cartRouter);
app.use("/ebagmart/admin", adminRouter);

// Default route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

// Connect to DB and start server
const PORT = process.env.PORT || 5000;
ConnectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("DB connection failed:", err);
    });
