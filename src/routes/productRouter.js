import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
} from "../controlers/productControler.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploads.js";

const productRouter = express.Router();

// Public routes
productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Admin routes
productRouter.post("/", protect, adminOnly, upload.array("images", 4), createProduct);
productRouter.put("/:id", protect, adminOnly, upload.array("images", 4), updateProduct);
productRouter.delete("/:id", protect, adminOnly, deleteProduct);

export default productRouter;
