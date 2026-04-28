import express from "express";
import * as userController from "../controllers/userController.js";
import { verifyToken, authorizeRoles ,validate,paginate} from "../middlewares/authMiddleware.js";
import { updateValidation } from "../validators/userValidator.js";


const router = express.Router();

router.use(verifyToken);

router.get("/", authorizeRoles("admin"),paginate, userController.getAllUsers);
router.get("/:id", authorizeRoles, userController.getUserById);
router.put("/:id",updateValidation,validate,userController.editUser);
router.delete("/:id", authorizeRoles("admin"), userController.deleteUser);

export default router;
