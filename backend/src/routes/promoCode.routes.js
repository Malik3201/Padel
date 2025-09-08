import express from "express";
import { createPromoCode, getPromoCodesByCourt, usePromoCode } from "../controllers/promoCode.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/",  createPromoCode);
router.get("/:courtId", getPromoCodesByCourt);
router.post("/use/:code", usePromoCode);

export default router;
