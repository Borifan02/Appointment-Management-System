// server/models/Appointment.js
const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    referenceCode: {
      type: String,
      unique: true,
      trim: true,
      default: () => `MED-${Math.floor(1000 + Math.random() * 9000)}`
    },
    clientName: {
      type: String,
      required: [true, "Please add the patient's full name"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Please add a contact email"],
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: [true, "Please add a contact phone number"],
      trim: true
    },
    specialistId: {
      type: String,
      required: [true, "Specialist ID is required"]
    },
    specialistName: {
      type: String,
      required: [true, "Specialist Name is required"]
    },
    serviceId: {
      type: String,
      required: [true, "Service ID is required"]
    },
    serviceName: {
      type: String,
      required: [true, "Service Name is required"]
    },
    date: {
      type: String, // YYYY-MM-DD
      required: [true, "Appointment date is required (YYYY-MM-DD)"]
    },
    time: {
      type: String, // HH:MM (24-hour)
      required: [true, "Appointment time is required (HH:MM)"]
    },
    duration: {
      type: Number,
      default: 30
    },
    price: {
      type: Number,
      default: 50
    },
    status: {
      type: String,
      enum: ["confirmed", "in-progress", "completed", "cancelled", "pending"],
      default: "confirmed"
    },
    priority: {
      type: String,
      enum: ["Routine", "Urgent", "Follow-up", "Consultation"],
      default: "Routine"
    },
    room: {
      type: String,
      default: "Suite 101"
    },
    notes: {
      type: String,
      default: ""
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to quickly detect double-booking conflicts
AppointmentSchema.index({ specialistId: 1, date: 1, time: 1 });

module.exports = mongoose.model("Appointment", AppointmentSchema);
