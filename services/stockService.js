import * as stockQueries from "../dbqueries/stockQueries.js"

export const updateInventory = async (productId, quantity) => {
    if (quantity < 0) {
        throw { statusCode: 400, message: "Quantity cannot be negative" };
    }
    const updatedStock = await stockQueries.updateStock(productId, quantity);
    if (!updatedStock) {
        throw { statusCode: 404, message: "Stock record not found for this product" };
    }
    return updatedStock;
};

export const getLowStockAlerts = async (page, limit) => {
    const skip = (page - 1) * limit;
    // We'll need a query for this, or just filter in memory for simplicity if small, 
    // but better to add a query. For now I'll use the getAllStocks and filter if needed, 
    // but let's assume we want efficient querying.
    // I'll add getLowStockProducts to stockQueries.
    const stocks = await stockQueries.getAllStocks(skip, limit);
    return stocks.filter(s => s.available_products <= s.lowStockThreshold);
};

export const getAllStocks = async (page, limit) => {
    const skip = (page - 1) * limit;
    const stocks = await stockQueries.getAllStocks(skip, limit);
    const total = await stockQueries.getStockCount();
    return {
        total,
        page,
        pages: Math.ceil(total / limit),
        stocks,
    }
};

export const getStockByProductId = async (productId) => {
    const stock = await stockQueries.getStockbyProductId(productId)
    if (!stock) {
        throw { statusCode: 404, message: "Stock record not found" };
    }
    return stock;
}