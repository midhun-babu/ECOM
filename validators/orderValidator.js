import { body, param } from "express-validator";

export const updateOrderStatusValidation = [
    param("orderId").isMongoId().withMessage("Invalid Order ID format"),
  
    body("paymentStatus").optional().isIn(["pending", "completed", "failed", "refunded"]).withMessage("Invalid payment status"),
  
    body("deliveryStatus").optional().isIn(["pending", "processed", "shipped", "delivered", "cancelled"]).withMessage("Invalid delivery status"),
    
    body("shippingAddress.addressLine1").optional().notEmpty().withMessage("Address cannot be empty").trim(),
    
    body("shippingAddress.city").optional().notEmpty().withMessage("City is required").trim(),
    
    body("shippingAddress.postalCode").optional().isNumeric().withMessage("Postal code must be numeric"),
];


