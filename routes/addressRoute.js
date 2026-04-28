import express from "express";
import {
  addAddress,
  getAllAddresses,
  getMyAddresses,
  makeDefault,
  updateMyAddress,
} from "../controllers/addressController.js";
import { authorizeRoles, verifyToken,validate } from "../middlewares/authMiddleware.js";
import { addressValidation } from "../validators/addressValidator.js";

const router = express.Router();

router.use(verifyToken);

router.post("/",addressValidation,validate,addAddress);
router.get("/", getMyAddresses);
router.put("/:id", updateMyAddress);
router.patch("/default/:id", makeDefault);
router.use("/all", authorizeRoles("admin"), getAllAddresses);

export default router;

