import * as cartQueries from "../dbqueries/cartQueries.js";
import * as productQueries from "../dbqueries/productQueries.js";
import Cart from "../models/cartModel.js";

export const addToCart = async (userId, productId, quantityInput) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };

  const quantity = Number(quantityInput);
  if (isNaN(quantity) || quantity <= 0) {
    throw { statusCode: 400, message: "Invalid quantity provided" };
  }

  const product = await productQueries.findProductById(productId);
  if (!product) throw { statusCode: 404, message: "Product not found" };

  let cart = await cartQueries.getCartByUserId(userId);

  if (!cart) {
    cart = new Cart({
      userid: userId,
      products: [
        {
          productid: productId,
          pname: product.pname,
          quantity,
          price: product.price,
        },
      ],
      active: true,
    });
  } else {
    const itemIndex = cart.products.findIndex(
      (p) => p.productid?.toString() === productId.toString(),
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({
        productid: productId,
        pname: product.pname,
        quantity,
        price: product.price,
      });
    }
  }

  return await cart.save();
};

export const getCart = async (userId) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  return await cartQueries.getCartByUserId(userId);
};

export const getAllCart = async () => {
  return await cartQueries.getCarts();
};

export const removeFromCart = async (userId, productId, quantityInput) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  if (!productId) throw { statusCode: 400, message: "Product ID is required" };

  const cart = await cartQueries.getCartByUserId(userId);
  if (!cart) return null;

  const removeQty = Number(quantityInput) || 1;
  const itemIndex = cart.products.findIndex(
    (p) => p.productid?.toString() === productId.toString(),
  );

  if (itemIndex > -1) {
    const currentQty = cart.products[itemIndex].quantity;
    if (currentQty <= removeQty) cart.products.splice(itemIndex, 1);
    else cart.products[itemIndex].quantity -= removeQty;
  } else {
    throw { statusCode: 404, message: "Product not found in cart" };
  }

  return await cart.save();
};

export const clearCart = async (userId) => {
  if (!userId) throw { statusCode: 401, message: "Unauthorized" };
  return await cartQueries.updateCart(userId, { products: [] });
};
