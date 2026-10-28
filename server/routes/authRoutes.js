// server/routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getMe,
  getDemoPersonas
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/demo-personas", getDemoPersonas);

module.exports = router;
