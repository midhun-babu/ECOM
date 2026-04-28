import { body, param, query } from "express-validator";

export const addToCartValidation = [
  param("productId").notEmpty().withMessage("Product ID is required in URL"),
  body("quantity")
    .optional()
    .isInt({ min: 1 }).withMessage("Quantity must be at least 1")
];

export const removeFromCartValidation = [
  param("productId").notEmpty().withMessage("Product ID is required in URL"),
  query("qty")
    .optional()
    .isInt({ min: 1 }).withMessage("Removal quantity must be at least 1")
];

