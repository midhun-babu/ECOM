import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  role: {
      type: String,
      enum: ["productmanager", "inventorymanager", "admin","Dataanalyst","user"],
      default: "user",
      required: true,
  },
  name: { type: String,
        required: true, trim: true },
        uname: { type: String, required: true, unique: true, trim: true },
  email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
      type: String,
      required: true 
    },
  isDeleted: {
      type: Boolean,
      default: false },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

