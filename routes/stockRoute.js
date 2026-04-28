import express from "express";
import * as stockController from "../controllers/stockController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("inventorymanager", "admin"), stockController.getAllStocks);
router.get("/alerts", authorizeRoles("inventorymanager", "admin"), stockController.getLowStockAlerts);
router.get("/:productId", authorizeRoles("inventorymanager", "admin"), stockController.getStockByProductId);
router.put("/update", authorizeRoles("inventorymanager", "admin"), stockController.updateStock);

export default router;
