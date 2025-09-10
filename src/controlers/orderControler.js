import Order from "../models/orderModel.js";

// Place Order
export const placeOrder = async (req, res) => {
    const { shippingAddress, totalAmount, items } = req.body;
    try {
        const newOrder = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
            status: "Pending",
        });

        //  Removed Cart.clear because it's handled in frontend
        res.status(201).json({ message: "Order placed", order: newOrder });
    } catch (err) {
        res.status(500).json({ message: "Failed to place order", error: err.message });
    }
};




// Get logged-in user's orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).populate("items.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders", error: err.message });
    }
};

// Admin: Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("user", "name email").populate("items.product");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch all orders", error: err.message });
    }
};

// Admin: Update order status
export const updateOrderStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!order) return res.status(404).json({ message: "Order not found" });

        res.status(200).json({ message: "Order status updated", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to update status", error: err.message });
    }
};
