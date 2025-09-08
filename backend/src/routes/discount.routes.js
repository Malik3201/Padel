import express from "express";
import { createDiscount, getDiscountsByCourt } from "../controllers/discount.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Protected route → only logged-in users can create a discount
router.post("/", authenticate, createDiscount);

// Public route → anyone can see discounts of a court
router.get("/:courtId", getDiscountsByCourt);

export default router;
