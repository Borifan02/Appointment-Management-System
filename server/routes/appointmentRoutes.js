// server/routes/appointmentRoutes.js
const express = require("express");
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require("../controllers/appointmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(getAppointments)
  .post(createAppointment);

router
  .route("/:id")
  .get(getAppointmentById)
  .put(updateAppointment)
  .delete(protect, authorize("admin"), deleteAppointment);

module.exports = router;
