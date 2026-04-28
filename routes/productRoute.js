import express from "express";
import * as productController from "../controllers/productController.js";
import { verifyToken, authorizeRoles,validate ,paginate } from "../middlewares/authMiddleware.js"; 

import { 
  productValidation, 
  updateProductValidation,  
} from "../validators/productValidator.js";

const router = express.Router();

router.get("/",paginate, productController.getProducts);               
router.get("/:pid", productController.getProductById);     


router.post("/", verifyToken, authorizeRoles('admin'), productValidation,validate,productController.createProduct);   

router.delete("/:pid", verifyToken, productController.deleteProduct); 

router.put("/update/:pid", verifyToken, authorizeRoles('admin'), updateProductValidation,validate,productController.editProduct);

export default router;
