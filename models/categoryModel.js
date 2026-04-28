import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  Cid: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true },
});

const Category = mongoose.model.Category || mongoose.model("Category", categorySchema);

export default Category;




