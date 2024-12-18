import { Router } from "express";

const router = Router();

// Add dummy route for testing
router.get("/", (req, res) => {
  res.json({ message: "Route working!" });
});

export default router;
