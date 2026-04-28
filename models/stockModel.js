import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  pid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  available_products: { type: Number, required: true, min: 0 },
  reserved_products: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 10 }
});

const Inventory=mongoose.models.Stock|| mongoose.model("Stock",stockSchema);

export default Inventory