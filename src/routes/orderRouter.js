import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from "../controlers/orderControler.js";

const orderRouter = express.Router();

// Protected routes
orderRouter.post("/", protect, placeOrder);
orderRouter.get("/my-orders", protect, getMyOrders);

// Admin routes
orderRouter.get("/", protect, adminOnly, getAllOrders);
orderRouter.put("/:id", protect, adminOnly, updateOrderStatus);

export default orderRouter;
