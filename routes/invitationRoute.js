import express from "express";
import * as invitationController from "../controllers/invitationController.js";
import { verifyToken, authorizeRoles, paginate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/send",verifyToken,authorizeRoles("admin"), invitationController.sendInvitation);

router.get("/verify/:token", invitationController.verifyInvitation);

router.get("/all",verifyToken,authorizeRoles("admin"),paginate,invitationController.listInvitations);

export default router;