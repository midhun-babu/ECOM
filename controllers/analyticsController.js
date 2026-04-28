import Order from "../models/orderModel.js";

export const getRevenueAnalytics = async (req, res, next) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$total" } } }
    ]);

    const revenueByDate = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue: totalRevenue[0]?.total || 0,
        revenueByDate
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTopProducts = async (req, res, next) => {
  try {
    const topProducts = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: "$items.subtotal" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({ success: true, data: topProducts });
  } catch (error) {
    next(error);
  }
};

export const getOrderTrends = async (req, res, next) => {
  try {
    const ordersByDay = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({ success: true, data: { ordersByDay } });
  } catch (error) {
    next(error);
  }
};

export const getSalesTrends = async (req, res, next) => {
    try {
        const { type = 'daily' } = req.query; // daily, weekly, monthly
        
        let format = "%Y-%m-%d";
        if (type === 'weekly') format = "%Y-%U";
        if (type === 'monthly') format = "%Y-%m";

        const trends = await Order.aggregate([
            { $match: { paymentStatus: "completed" } },
            {
                $group: {
                    _id: { $dateToString: { format, date: "$createdAt" } },
                    revenue: { $sum: "$total" },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({ success: true, type, data: trends });
    } catch (error) {
        next(error);
    }
};
