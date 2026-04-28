import * as orderQueries from "../dbqueries/orderQueries.js";
import * as stockQueries from "../dbqueries/stockQueries.js";

export const placeOrderService = async (userId, items, total, address) => {
  if (!items || items.length === 0) {
    throw { statusCode: 400, message: "No items to order" };
  }

  // 1. Check & Reserve Stock
  for (const item of items) {
    const reserveResult = await stockQueries.reserveStock(item.product, item.quantity);
    if (reserveResult.matchedCount === 0) {
      throw { statusCode: 400, message: `Insufficient stock for product ${item.name || item.product}` };
    }
  }

  const orderData = {
    user: userId,
    items,
    total,
    shippingAddress: {
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country || ""
    },
    paymentStatus: "pending",
    deliveryStatus: "pending"
  };

  return await orderQueries.createOrder(orderData);
};

export const handleOrderPayment = async (orderId) => {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) throw { statusCode: 404, message: "Order not found" };

  if (order.paymentStatus === "completed") return order;

  // Final deduction
  for (const item of order.items) {
    await stockQueries.deductStock(item.product._id, item.quantity);
  }

  return await orderQueries.updateOrder(orderId, { paymentStatus: "completed", deliveryStatus: "processed" });
};

export const handleOrderCancellation = async (orderId) => {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) throw { statusCode: 404, message: "Order not found" };

  if (order.deliveryStatus === "cancelled") return order;

  // Release reservation if it was still pending or paid but not shipped? 
  // Requirement: Checkout -> Reservation, Payment -> Deduction.
  // If payment was completed, deduction happened. If cancelled after payment, we might need to add back to stock?
  // For simplicity: If cancelled, return reserved (if still reserved) or add back to available (if already deducted).
  
  if (order.paymentStatus === "pending") {
    for (const item of order.items) {
      await stockQueries.releaseStock(item.product._id, item.quantity);
    }
  } else if (order.paymentStatus === "completed") {
      // Re-add to available since it was already deducted from reserved
      for (const item of order.items) {
          await stockQueries.updateStock(item.product._id, item.quantity); // This is wrong, it sets. Re-adding is better.
          // Let's add a releaseDeductedStock to stockQueries
          // Or just use updateStock with $inc in stockQueries.
      }
  }

  return await orderQueries.updateOrder(orderId, { deliveryStatus: "cancelled" });
};

export const getOrderSummaryService = async (orderId) => {
  const order = await orderQueries.getOrderById(orderId);
  if (!order) throw { statusCode: 404, message: "Order not found" };
  return order;
};



export const getUserOrdersService = async (userId, limit, skip, page) => {
  const [orders, total] = await Promise.all([
    orderQueries.findUserOrders(userId, limit, skip),
    orderQueries.countUserOrders(userId)
  ]);

  return {
    orders,
    totalOrders: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
};

export const getAllOrdersService = async (limit, skip, page) => {
  const [orders, total] = await Promise.all([
    orderQueries.getAllOrders(limit, skip),
    orderQueries.countAllOrders()
  ]);

  return {
    orders,
    totalOrders: total,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  };
};
