import Order from "../models/orderModel.js";

// ✅ Place Order
export const placeOrder = async (req, res) => {
  const { shippingAddress, totalAmount, items } = req.body;

  // ✅ Validate required fields
  if (!shippingAddress || !totalAmount || !items || !items.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newOrder = await Order.create({
      user: req.user.id,
      items,
      totalAmount,
      shippingAddress,
      status: "Pending",
    });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

// ✅ Get orders of logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product", "name price images") // Select useful fields
      .sort({ createdAt: -1 }); // Latest first

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Fetch user orders failed:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};

// ✅ Admin: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("❌ Fetch all orders failed:", err);
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
    ).populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order });
  } catch (err) {
    console.error("❌ Update order status failed:", err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};
