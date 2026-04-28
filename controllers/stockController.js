import * as stockService from "../services/stockService.js";

// Update stock (Inventory Manager)
export const updateStock = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const result = await stockService.updateInventory(productId, quantity);
    res.status(200).json({ success: true, message: "Stock updated successfully", result });
  } catch (error) {
    next(error);
  }
};

// Get low stock alerts
export const getLowStockAlerts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await stockService.getLowStockAlerts(Number(page), Number(limit));
    res.status(200).json({ success: true, count: result.length, alerts: result });
  } catch (error) {
    next(error);
  }
};

// Get all stocks with pagination
export const getAllStocks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await stockService.getAllStocks(Number(page), Number(limit));
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

// Get stock by productId
export const getStockByProductId = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const result = await stockService.getStockByProductId(productId);
    res.status(200).json({ success: true, stock: result });
  } catch (error) {
    next(error);
  }
};
