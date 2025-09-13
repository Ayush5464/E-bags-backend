import Product from "../models/productModel.js";

// Create product
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;
        const images = req.files.map((file) => `/uploads/${file.filename}`);

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
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const { name, description, price, category, countInStock } = req.body;
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (category) product.category = category;
        if (countInStock) product.countInStock = countInStock;

        // If new images uploaded
        if (req.files && req.files.length > 0) {
            product.images = req.files.map((file) => `/uploads/${file.filename}`);
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
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete product" });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch products" });
    }
};

// Get product by id
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch product" });
    }
};
