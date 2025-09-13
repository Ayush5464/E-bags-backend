import express from "express";
import multer from "multer";
import path from "path";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
} from "../controlers/productControler.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const productRouter = express.Router();

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.resolve("uploads"); // absolute path
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w.-]/g, "");
        cb(null, `${Date.now()}-${cleanName}`);
    },
});

const upload = multer({ storage });

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin routes
productRouter.post("/", protect, adminOnly, upload.array("images", 4), createProduct);
productRouter.put("/:id", protect, adminOnly, upload.array("images", 4), updateProduct);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);

export default productRouter;
