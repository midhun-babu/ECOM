import { body } from "express-validator";

export const productValidation = [
    body("pid").notEmpty().withMessage("Product ID (pid) is required").trim(),
    body("pname").notEmpty().withMessage("Product name (pname) is required").trim(),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock cannot be negative"),];

export const updateProductValidation = productValidation.map(rule => rule.optional());
