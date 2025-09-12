import Product from "../models/productModel.js";

// Create Product with multiple images
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required." });
        }

        const images = req.files.map((file) => `/uploads/${file.filename}`);

        const product = await Product.create({
            name,
            description,
            price,
            category,
            countInStock,
            images,
        });

        res.status(201).json({ message: "Product created", product });
    } catch (err) {
        console.error("Error in createProduct:", err.message);
        res.status(500).json({ message: "Failed to create product", error: err.message });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Error fetching products", error: err.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ message: "Error fetching product", error: err.message });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map((file) => `/uploads/${file.filename}`);
        }

        const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product updated", product });
    } catch (err) {
        res.status(500).json({ message: "Error updating product", error: err.message });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting product", error: err.message });
    }
};
