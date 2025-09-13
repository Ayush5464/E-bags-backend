import express from "express";
import multer from "multer";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controlers/productControler.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const productRouter = express.Router();

// ✅ Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const cleanName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, "-")           // Replace spaces with dashes
            .replace(/[^\w.-]/g, "");       // Remove non-safe characters

        cb(null, `${Date.now()}-${cleanName}`);
    },
});

const upload = multer({ storage });

// ✅ Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// ✅ Admin-only routes
productRouter.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 4), // Accept up to 4 images
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
