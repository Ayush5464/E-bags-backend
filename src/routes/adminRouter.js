// routes/adminRouter.js
import express from "express";
import {
    deleteOrder,
    deleteUser,
    getAdminStats,
    getAllOrders,
    getAllUsers,
    updateOrderStatus,
    updateUserRole
} from "../controlers/adminControler.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();

// Stats
adminRouter.get("/stats", protect, adminOnly, getAdminStats);

// Users
adminRouter.get("/users", protect, adminOnly, getAllUsers);
adminRouter.delete("/users/:id", protect, adminOnly, deleteUser);
adminRouter.put("/users/:id", protect, adminOnly, updateUserRole);

// Orders
adminRouter.get("/orders", protect, adminOnly, getAllOrders);
adminRouter.put("/orders/:id", protect, adminOnly, updateOrderStatus);
adminRouter.delete("/orders/:id", protect, adminOnly, deleteOrder);

export default adminRouter;
