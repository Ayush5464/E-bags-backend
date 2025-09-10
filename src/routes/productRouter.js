import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controlers/productControler.js";
import multer from "multer";

const productRoute = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Public routes
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);

// Admin-only routes
// Accept multiple images (main + 3 similar images)
productRoute.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 4), // <-- changed
    createProduct
);

// Update product with optional new images
productRoute.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 4), // <-- allows replacing multiple images
    updateProduct
);

productRoute.delete("/:id", protect, adminOnly, deleteProduct);

export default productRoute;
