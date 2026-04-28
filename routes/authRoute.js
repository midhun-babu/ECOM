import express from "express";
import * as authControl from "../controllers/authController.js";
import { verifyToken, validate } from "../middlewares/authMiddleware.js";
import { registerValidation } from "../validators/userValidator.js";

const router = express.Router();

router.post("/login", authControl.login);
router.post("/register", registerValidation, validate, authControl.register);

router.post("/invite", registerValidation, authControl.registerFromInvite);

router.post("/refresh", authControl.refresh);
router.post("/logout", authControl.logout);

router.get("/profile", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to your profile",
    user: req.user, 
  });
});

export default router;

