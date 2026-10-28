// server/controllers/appointmentController.js
const Appointment = require("../models/Appointment");

// Helper conflict checker for overlapping appointments
const checkConflict = async (specialistId, date, time, duration = 30, excludeId = null) => {
  const parseTimeToMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const newStart = parseTimeToMin(time);
  const newEnd = newStart + Number(duration);

  const query = { specialistId, date };
  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const existingApts = await Appointment.find(query);

  for (const apt of existingApts) {
    if (apt.status === "cancelled") continue;
    const existingStart = parseTimeToMin(apt.time);
    const existingEnd = existingStart + (Number(apt.duration) || 30);

    // Overlap condition: max(start1, start2) < min(end1, end2)
    if (Math.max(newStart, existingStart) < Math.min(newEnd, existingEnd)) {
      return apt;
    }
  }
  return null;
};

// @desc    Get all appointments (supports filters)
// @route   GET /api/appointments
// @access  Public (or Protected depending on config)
exports.getAppointments = async (req, res) => {
  try {
    const { date, specialistId, status, email, search } = req.query;
    const filter = {};

    if (date) filter.date = date;
    if (specialistId) filter.specialistId = specialistId;
    if (status) filter.status = status;
    if (email) filter.email = email.toLowerCase();

    if (search) {
      filter.$or = [
        { clientName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { referenceCode: { $regex: search, $options: "i" } },
        { serviceName: { $regex: search, $options: "i" } }
      ];
    }

    const appointments = await Appointment.find(filter).sort({ date: -1, time: 1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to fetch appointments"
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Public
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Public / Protected
exports.createAppointment = async (req, res) => {
  try {
    const {
      clientName,
      email,
      phone,
      specialistId,
      specialistName,
      serviceId,
      serviceName,
      date,
      time,
      duration = 30,
      price = 50,
      priority = "Routine",
      room = "Suite 101",
      notes = ""
    } = req.body;

    // Check for double booking conflict
    const conflict = await checkConflict(specialistId, date, time, duration);
    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Time slot conflict: ${specialistName} already has an appointment with ${conflict.clientName} at ${conflict.time}.`,
        conflict
      });
    }

    const appointment = await Appointment.create({
      clientName,
      email: email.toLowerCase(),
      phone,
      specialistId,
      specialistName,
      serviceId,
      serviceName,
      date,
      time,
      duration,
      price,
      priority,
      room,
      notes,
      createdBy: req.user ? req.user._id : null
    });

    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to create appointment"
    });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Protected
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    // If changing time or specialist, check for conflict
    const targetSpecialistId = req.body.specialistId || appointment.specialistId;
    const targetDate = req.body.date || appointment.date;
    const targetTime = req.body.time || appointment.time;
    const targetDuration = req.body.duration || appointment.duration;

    if (
      targetSpecialistId !== appointment.specialistId ||
      targetDate !== appointment.date ||
      targetTime !== appointment.time
    ) {
      const conflict = await checkConflict(
        targetSpecialistId,
        targetDate,
        targetTime,
        targetDuration,
        appointment._id
      );

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: `Reschedule conflict: Target slot overlaps with ${conflict.clientName} at ${conflict.time}.`,
          conflict
        });
      }
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to update appointment"
    });
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Protected (Admin only)
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Appointment removed successfully",
      id: req.params.id
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to delete appointment"
    });
  }
};
