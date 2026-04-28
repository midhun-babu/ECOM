import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    pid: { type: String, required: true, unique: true },
    pname: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    is_deleted: { type: Boolean, default: false }
  }
);

const Product =mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
