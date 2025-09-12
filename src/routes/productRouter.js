import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
    updateProduct,
} from "../controlers/productControler.js"; // keep your import as-is
import multer from "multer";
import path from "path";
import fs from "fs";

const productRoute = express.Router();

// Multer setup: store images in 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(path.resolve(), "uploads");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    },
});

const upload = multer({ storage });

// Public routes
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);

// Admin-only routes: create & update product with multiple images
productRoute.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 5), // up to 5 images
    createProduct
);

productRoute.put(
    "/:id",
    protect,
    adminOnly,
    upload.array("images", 5),
    updateProduct
);

productRoute.delete("/:id", protect, adminOnly, deleteProduct);

export default productRoute;
