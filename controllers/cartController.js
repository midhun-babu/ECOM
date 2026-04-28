import * as cartService from "../services/cartService.js";

export const addItem = async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const userId = req.user?.id;
    const productId = req.params?.productId;

    if (!productId) return res.status(400).json({ message: "Invalid product" });

    const cart = await cartService.addToCart(userId, productId, quantity);

    res.status(201).json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const cart = await cartService.getCart(userId);

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(cart,{message:"MY CART"});
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const getAllCart = async (req, res) => {
  try {
    const carts = await cartService.getAllCart();

    if (!carts || carts.length === 0) return res.status(404).json({ message: "No carts exist" });

    res.status(200).json(carts);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const removeItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = req.params?.productId;
    const quantity = req.body.qty;

    const updatedCart = await cartService.removeFromCart(userId, productId, quantity);

    if (!updatedCart) return res.status(404).json({ message: "Cart not found" });

    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message || "Internal server error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const clearedCart = await cartService.clearCart(userId);
    res.status(200).json(clearedCart);
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};