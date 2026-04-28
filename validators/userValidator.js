import { body } from "express-validator";

export const registerValidation = [
  body("name").notEmpty().withMessage("Name is required").isLength({ min: 2 }).withMessage("Name must be at least 2 characters long").trim(),

  body("uname").notEmpty().withMessage("Username is required").isLength({ min: 3 }).withMessage("Username must be at least 3 characters").trim(),

  body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  
  body("role").optional().isIn(["productmanager", "inventorymanager", "admin","Dataanalyst","user"]).withMessage("Role must be from the given list"),];


export const updateValidation = [
  body("name").optional().isLength({ min: 2 }).withMessage("Name must be at least 2 characters long").trim(),

  body("uname").optional().isLength({ min: 3 }).withMessage("Username must be at least 3 characters").trim(),
  
  body("email").optional().isEmail().withMessage("Please provide a valid email address").normalizeEmail(),

  body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
];








