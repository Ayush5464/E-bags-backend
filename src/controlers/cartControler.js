import Cart from "../models/cartModel.js";

// Get user's cart
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
        res.status(200).json(cart || { user: req.user.id, items: [] });
    } catch (err) {
        res.status(500).json({ message: "Failed to get cart", error: err.message });
    }
};

// Add item to cart
export const addToCart = async (req, res) => {
    const { product, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [{ product, quantity }],
            });
        } else {
            const existingItem = cart.items.find(item => item.product.toString() === product);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ product, quantity });
            }

            await cart.save();
        }

        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        res.status(500).json({ message: "Add to cart failed", error: err.message });
    }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json({ message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ message: "Remove failed", error: err.message });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user.id },
            { items: [] },
            { new: true }
        );

        res.status(200).json({ message: "Cart cleared", cart });
    } catch (err) {
        res.status(500).json({ message: "Clear failed", error: err.message });
    }
};
