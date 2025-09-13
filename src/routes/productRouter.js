// routes/productRouter.js
import express from "express";
import multer from "multer";
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
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const cleanName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-") // replace spaces
            .replace(/[^\w.-]/g, ""); // remove unsafe chars
        cb(null, `${Date.now()}-${cleanName}`);
    },
});

const upload = multer({ storage });

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin routes
productRouter.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 4),
    createProduct
);
productRouter.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 4),
    updateProduct
);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);

export default productRouter;
