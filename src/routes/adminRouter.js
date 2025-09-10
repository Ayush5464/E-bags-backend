import express from "express";
import { deleteOrder, deleteUser, getAdminStats, getAllOrders, getAllUsers, updateOrderStatus, updateUserRole } from "../controlers/adminControler.js"
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const adminRouter = express.Router();
// product manage
adminRouter.get("/stats", protect, adminOnly, getAdminStats);
adminRouter.get("/users", protect, adminOnly, getAllUsers);

// user manage
adminRouter.delete("/users/:id", protect, adminOnly, deleteUser);
adminRouter.put("/users/:id", protect, adminOnly, updateUserRole);


// order manage
adminRouter.get("/orders", protect, getAllOrders);
adminRouter.put("/orders/:id", protect, updateOrderStatus);
adminRouter.delete("/orders/:id", protect, deleteOrder);


export default adminRouter;
