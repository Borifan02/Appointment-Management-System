// server/routes/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getMe,
  getDemoPersonas,
  provisionStaff
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/demo-personas", getDemoPersonas);
router.post("/provision-staff", protect, authorize("admin"), provisionStaff);

module.exports = router;
