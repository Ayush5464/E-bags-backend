// controlers/productControler.js
import Product from "../models/Product.js";

// Create product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        const images = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const product = await Product.create({
            name,
            description,
            price,
            category,
            countInStock,
            images,
        });

        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create product" });
    }
};

// Update product
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const { name, description, price, category, countInStock } = req.body;

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.countInStock = countInStock || product.countInStock;

        if (req.files && req.files.length > 0) {
            product.images = req.files.map(f => `/uploads/${f.filename}`);
        }

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update product" });
    }
};

// Delete product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

// Get product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
