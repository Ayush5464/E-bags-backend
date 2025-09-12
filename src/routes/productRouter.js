import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controllers/productController.js";
import multer from "multer";

const router = express.Router();

// Multer setup for multiple images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, adminOnly, upload.array("images", 4), createProduct);
router.put("/:id", protect, adminOnly, upload.array("images", 4), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
