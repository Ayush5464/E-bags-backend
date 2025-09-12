import Order from "../models/orderModel.js";

// ✅ Place Order
export const placeOrder = async (req, res) => {
    const { shippingAddress, totalAmount, items } = req.body;

    if (!shippingAddress || !totalAmount || !items || items.length === 0) {
        return res.status(400).json({ message: "Missing order fields" });
    }

    try {
        const newOrder = await Order.create({
            user: req.user._id || req.user.id, // ✅ safer for Mongo _id
            items,
            totalAmount,
            shippingAddress,
            status: "Pending",
        });

        res.status(201).json({ message: "Order placed", order: newOrder });
    } catch (err) {
        console.error("❌ Order placement error:", err);
        res.status(500).json({ message: "Failed to place order", error: err.message });
    }
};

// ✅ Get logged-in user's orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id || req.user.id })
            .populate("items.product");

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ My orders fetch error:", err);
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
};

// ✅ Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.product");

        res.status(200).json(orders);
    } catch (err) {
        console.error("❌ Get all orders error:", err);
        res.status(500).json({ message: "Failed to fetch all orders", error: err.message });
    }
};

// ✅ Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: "Status is required" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        console.error("❌ Update status error:", err);
        res.status(500).json({ message: "Failed to update status", error: err.message });
    }
};
