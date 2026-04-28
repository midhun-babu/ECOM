import Inventory from "../models/stockModel.js"

export const getStockbyId=async(stockId)=>{
    return await Inventory.findOne({_id:stockId});
};

export const getStockbyProductId=async (productId)=>{
    return await Inventory.findOne({pid:productId})
};

export const getAllStocks=async(skip,limit)=>{
    return await Inventory.find({})
    .skip(skip)
    .limit(limit);
};

export const createStock = async (stockData) => {
  return await Inventory.create(stockData);
};

export const updateStock = async (productId, quantity) => {
  return await Inventory.findOneAndUpdate(
    { pid: productId },
    { $set: { available_products: quantity } },
    { new: true }
  );
};

export const reserveStock = async (productId, quantity) => {
  return await Inventory.updateOne(
    { pid: productId, available_products: { $gte: quantity } },
    { 
      $inc: { 
        available_products: -quantity,
        reserved_products: quantity 
      } 
    }
  );
};

export const releaseStock = async (productId, quantity) => {
  return await Inventory.updateOne(
    { pid: productId, reserved_products: { $gte: quantity } },
    { 
      $inc: { 
        available_products: quantity,
        reserved_products: -quantity 
      } 
    }
  );
};

export const deductStock = async (productId, quantity) => {
  return await Inventory.updateOne(
    { pid: productId, reserved_products: { $gte: quantity } },
    { $inc: { reserved_products: -quantity } }
  );
};

export const getStockCount = async () => {
  return await Inventory.countDocuments();
};
