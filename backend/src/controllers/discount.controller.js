import Discount from "../models/discount.model.js";

export const createDiscount = async (req, res) => {
  try {
    const discount = new Discount(req.body);
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDiscountsByCourt = async (req, res) => {
  try {
    const discounts = await Discount.find({ courtId: req.params.courtId });
    res.json(discounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
