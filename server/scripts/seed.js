// server/scripts/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicare_hub";

const toISODate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (d, days) => {
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
};

const seedData = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    // Clear existing data
    await User.deleteMany();
    await Appointment.deleteMany();
    console.log("Cleared old records.");

    // Seed Users
    const users = await User.create([
      {
        name: "Dr. Catherine Hayes",
        email: "admin@medicare.com",
        password: "AdminPassword123!",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
      },
      {
        name: "Dr. Evelyn Reed",
        email: "doctor.reed@medicare.com",
        password: "DoctorPassword123!",
        role: "doctor",
        specialistId: "spec-1",
        avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
      },
      {
        name: "Sarah Jenkins",
        email: "reception@medicare.com",
        password: "StaffPassword123!",
        role: "receptionist",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
      },
      {
        name: "Eleanor Vance",
        email: "eleanor.vance@example.com",
        password: "PatientPassword123!",
        role: "patient",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
      }
    ]);
    console.log(`Created ${users.length} system users.`);

    // Seed Appointments
    const now = new Date();
    const today = toISODate(now);
    const tomorrow = toISODate(addDays(now, 1));
    const dayAfter = toISODate(addDays(now, 2));

    const appointments = [
      {
        referenceCode: "MED-1011",
        clientName: "Eleanor Vance",
        email: "eleanor.vance@example.com",
        phone: "+1 (555) 234-8901",
        specialistId: "spec-1",
        specialistName: "Dr. Evelyn Reed",
        serviceId: "srv-1",
        serviceName: "General Consultation",
        date: today,
        time: "09:00",
        duration: 30,
        price: 75,
        status: "confirmed",
        priority: "Routine",
        room: "Suite 101",
        notes: "Follow-up for hypertension management and routine prescription renewal."
      },
      {
        referenceCode: "MED-1012",
        clientName: "Marcus Sterling",
        email: "m.sterling@example.com",
        phone: "+1 (555) 892-3411",
        specialistId: "spec-1",
        specialistName: "Dr. Evelyn Reed",
        serviceId: "srv-2",
        serviceName: "Comprehensive Health Check",
        date: today,
        time: "10:00",
        duration: 45,
        price: 150,
        status: "in-progress",
        priority: "Urgent",
        room: "Suite 101",
        notes: "Reports intermittent chest discomfort and shortness of breath upon exertion."
      },
      {
        referenceCode: "MED-1013",
        clientName: "Sophia Chen",
        email: "sophia.chen@example.com",
        phone: "+1 (555) 782-9901",
        specialistId: "spec-2",
        specialistName: "Dr. Marcus Vance",
        serviceId: "srv-3",
        serviceName: "Cardiology Assessment",
        date: today,
        time: "11:30",
        duration: 45,
        price: 180,
        status: "pending",
        priority: "Follow-up",
        room: "Suite 204",
        notes: "Holter monitor readout and echocardiogram evaluation."
      },
      {
        referenceCode: "MED-1014",
        clientName: "Liam O'Connor",
        email: "liam.oc@example.com",
        phone: "+1 (555) 431-7788",
        specialistId: "spec-1",
        specialistName: "Dr. Evelyn Reed",
        serviceId: "srv-1",
        serviceName: "General Consultation",
        date: tomorrow,
        time: "14:00",
        duration: 30,
        price: 75,
        status: "confirmed",
        priority: "Routine",
        room: "Suite 101",
        notes: "Annual executive health review."
      },
      {
        referenceCode: "MED-1015",
        clientName: "Hannah Abbott",
        email: "hannah.a@example.com",
        phone: "+1 (555) 671-2299",
        specialistId: "spec-3",
        specialistName: "Dr. Amara Patel",
        serviceId: "srv-5",
        serviceName: "Dermatology Screening",
        date: dayAfter,
        time: "10:30",
        duration: 30,
        price: 120,
        status: "confirmed",
        priority: "Routine",
        room: "Clinic 3A",
        notes: "Skin lesion full check and biopsy review."
      }
    ];

    await Appointment.insertMany(appointments);
    console.log(`Created ${appointments.length} sample appointments.`);

    console.log("✅ Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedData();
