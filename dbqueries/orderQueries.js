import Order from "../models/orderModel.js";
import mongoose from "mongoose";

export const createOrder = async (orderData) => {
  return await Order.create(orderData);
};

export const getOrderById = async (orderId) => {
  const objectId = new mongoose.Types.ObjectId(orderId);

  const result = await Order.aggregate([
    { $match: { _id: objectId } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "products",
        localField: "products.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "pd",
                      cond: { $eq: ["$$pd._id", "$$item.product"] }
                    }
                  },
                  0
                ]
              },
              quantity: "$$item.quantity",
              price: "$$item.price",
              subtotal: { $multiply: ["$$item.quantity", "$$item.price"] }
            }
          }
        }
      }
    },
    { $project: { productDetails: 0 } }
  ]);

  return result[0];
};

export const getOrdersByUser = async (userId, limit, skip) => {
  const objectId = new mongoose.Types.ObjectId(userId);

  return await Order.aggregate([
    { $match: { user: objectId } },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "pd",
                      cond: { $eq: ["$$pd._id", "$$item.product"] }
                    }
                  },
                  0
                ]
              },
              quantity: "$$item.quantity",
              price: "$$item.price",
              subtotal: { $multiply: ["$$item.quantity", "$$item.price"] }
            }
          }
        }
      }
    },
    { $project: { productDetails: 0 } }
  ]);
};

export const getAllOrders = async (limit, skip) => {
  return await Order.aggregate([
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userDetails"
      }
    },
    { $unwind: "$userDetails" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productDetails"
      }
    },
    {
      $addFields: {
        items: {
          $map: {
            input: "$items",
            as: "item",
            in: {
              product: {
                $arrayElemAt: [
                  {
                    $filter: {
                      input: "$productDetails",
                      as: "pd",
                      cond: { $eq: ["$$pd._id", "$$item.product"] }
                    }
                  },
                  0
                ]
              },
              quantity: "$$item.quantity",
              price: "$$item.price",
              subtotal: { $multiply: ["$$item.quantity", "$$item.price"] }
            }
          }
        }
      }
    },
    { $project: { productDetails: 0 } }
  ]);
};

export const countUserOrders = async (userId) => {
  return await Order.countDocuments({ user: userId });
};

export const countAllOrders = async () => {
  return await Order.countDocuments();
};

export const updateOrder = async (orderId, updateData) => {
  return await Order.findByIdAndUpdate(orderId, updateData, { new: true });
};