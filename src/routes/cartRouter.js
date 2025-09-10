import express from "express";


import { protect } from "../middleware/authMiddleware.js";
import { addToCart, clearCart, getCart, removeFromCart } from "../controlers/cartControler.js";

const cartRouter = express.Router();

cartRouter.get("/", protect, getCart);
cartRouter.post("/", protect, addToCart);
cartRouter.delete("/:productId", protect, removeFromCart);
cartRouter.delete("/", protect, clearCart);

export default cartRouter;
