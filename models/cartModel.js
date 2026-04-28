import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productid: { type: String, required: true },
      pname:{type:String,required:true}, 
      quantity: { type: Number, required: true, min: 1, default: 1 },
      price: { type: Number, required: true }, 
    },
  ],
  totalPrice: { type: Number, default: 0 },
  active: { type: Boolean, default: true } 
});

cartSchema.pre("save", function () {
  this.totalPrice = this.products.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
