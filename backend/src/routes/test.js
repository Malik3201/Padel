import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * POST /api/test/token
 * body: { role: "admin" | "owner" | "organizer" | "player", id?: "optionalId" }
 * returns a signed token for testing
 */
router.post("/token", (req, res) => {
  const { role = "admin", id = `${role}-1` } = req.body || {};
  const token = jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, devToken: `dev-${role}` });
});

export default router;
