import user from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from '../models/orderModel.js';

// Admin Dashboard Stats
export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const ordersByStatus = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };
        orders.forEach((order) => {
            ordersByStatus[order.status] += 1;
        });

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
};

// GET all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find().sort({ createdAt: -1 }).select("-password");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await user.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete user", error: err.message });
    }
};

// UPDATE user role
export const updateUserRole = async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const updatedUser = await user.findByIdAndUpdate(
            req.params.id,
            { isAdmin },
            { new: true }
        );
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User role updated", user: updatedUser });
    } catch (err) {
        res.status(500).json({ message: "Failed to update role", error: err.message });
    }
};

// GET all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order status updated", updatedOrder });
    } catch (err) {
        res.status(500).json({ message: "Failed to update order status", error: err.message });
    }
};

// DELETE order
export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedOrder = await Order.findByIdAndDelete(id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order", error: err.message });
    }
};
