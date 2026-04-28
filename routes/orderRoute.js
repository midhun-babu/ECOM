import express from "express";
import * as orderControl from "../controllers/orderController.js";
import { verifyToken, authorizeRoles,validate, paginate } from "../middlewares/authMiddleware.js";
import {updateOrderStatusValidation} from "../validators/orderValidator.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", authorizeRoles("user"),orderControl.placeOrder);

router.get("/summary", authorizeRoles,orderControl.getOrderSummary);

router.get("/orders", paginate,orderControl.getUserOrders);

router.get("/", authorizeRoles("admin"),paginate, orderControl.getAllOrders);

router.patch("/:orderId", authorizeRoles("admin"),updateOrderStatusValidation,validate, orderControl.updateOrderStatus);

router.put("/:orderId",authorizeRoles("user"),orderControl.cancelOrder);

export default router;