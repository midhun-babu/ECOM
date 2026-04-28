import express from "express";
import * as analyticsController from "../controllers/analyticsController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);
router.use(authorizeRoles("Dataanalyst", "admin"));

router.get("/revenue", analyticsController.getRevenueAnalytics);
router.get("/top-products", analyticsController.getTopProducts);
router.get("/trends", analyticsController.getOrderTrends);
router.get("/sales-trends", analyticsController.getSalesTrends);

export default router;
