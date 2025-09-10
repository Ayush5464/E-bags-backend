import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: String,
    countInStock: { type: Number, default: 0, required: true },
    images: [{ type: String, required: true }],

}, { timestamps: true });

export default mongoose.model("Product", productSchema);


