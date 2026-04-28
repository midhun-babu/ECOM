import express from "express";
import {
  addItem,
  getAllCart,
  getCart,
  removeItem,
  clearCart
} from "../controllers/cartController.js";
import { verifyToken, authorizeRoles , validate } from "../middlewares/authMiddleware.js";
import { addToCartValidation,removeFromCartValidation } from "../validators/cartValidator.js";

const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("admin"), getAllCart);

/////////////////////////////////////////////////
router.use(authorizeRoles("user"))

router.post("/:productId",addToCartValidation,validate,addItem);
router.get("/my", getCart);
router.delete("/:productId",removeFromCartValidation,validate, removeItem);
router.delete("/clear", clearCart);

export default router;