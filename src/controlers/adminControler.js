import user from "../models/userModel.js";
import Product from "../models/productModel.js";
import Order from '../models/orderModel.js'

export const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await user.countDocuments()
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        const orders = await Order.find();

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        const statusBreakdown = {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0
        };

        orders.forEach(order => {
            statusBreakdown[order.status] += 1;
        });

        res.status(200).json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            ordersByStatus: statusBreakdown,
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats", error: err.message });
    }
};



// GET all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await user.find().sort({ createdAt: -1 }).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

// DELETE user
export const deleteUser = async (req, res) => {
    try {
        const user = await user.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete user" });
    }
};

// UPDATE user role
export const updateUserRole = async (req, res) => {
    try {
        const { isAdmin } = req.body;
        const user = await user.findByIdAndUpdate(req.params.id, { isAdmin }, { new: true });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ message: "User role updated", user });
    } catch (error) {
        res.status(500).json({ message: "Failed to update role" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
};

export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;


    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        res.json({ message: "Status updated", updatedOrder });
    } catch (err) {
        res.status(500).json({ message: "Failed to update status" });
    }
};

export const deleteOrder = async (req, res) => {
    const { id } = req.params;

    try {
        await Order.findByIdAndDelete(id);
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
};