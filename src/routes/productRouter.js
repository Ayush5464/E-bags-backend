import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploads.js";
import { createProduct, deleteProduct, getAllProducts, getProductById } from "../controlers/productControler.js"

const productRoute = express.Router();

// Public routes
productRoute.get("/", getAllProducts);
productRoute.get("/:id", getProductById);

// Admin-only routes with image upload
productRoute.post(
    "/",
    protect,
    adminOnly,
    upload.array("images", 5), // allows up to 5 images
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
