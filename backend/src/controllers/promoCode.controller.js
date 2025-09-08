import PromoCode from "../models/promoCode.model.js";

export const createPromoCode = async (req, res) => {
  try {
    const promo = new PromoCode(req.body);
    await promo.save();
    res.status(201).json(promo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getPromoCodesByCourt = async (req, res) => {
  try {
    const promos = await PromoCode.find({ courtId: req.params.courtId });
    res.json(promos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const usePromoCode = async (req, res) => {
  try {
    const promo = await PromoCode.findOne({ code: req.params.code });
    if (!promo) return res.status(404).json({ error: "Promo code not found" });

    if (promo.usedCount >= promo.usageLimit) {
      return res.status(400).json({ error: "Promo code usage limit reached" });
    }

    if (new Date() < promo.startDate || new Date() > promo.endDate) {
      return res.status(400).json({ error: "Promo code expired or not active" });
    }

    promo.usedCount += 1;
    await promo.save();

    res.json({ success: true, discountType: promo.discountType, discountValue: promo.discountValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
