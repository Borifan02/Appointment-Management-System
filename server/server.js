// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
app.use(
  cors({
    origin: [clientUrl, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true
  })
);

// Request Logger (Development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "MediCare Hub API",
    version: "1.0.0",
    mongodbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);

// Root endpoint welcome message
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>MediCare Hub API</title></head>
      <body style="font-family: system-ui, sans-serif; padding: 40px; background: #0f172a; color: #f8fafc;">
        <h2>🏥 MediCare Hub Backend API</h2>
        <p>Production Node.js, Express & MongoDB backend running smoothly.</p>
        <p>Health check: <a href="/api/health" style="color: #38bdf8;">/api/health</a></p>
        <p>Appointments endpoint: <a href="/api/appointments" style="color: #38bdf8;">/api/appointments</a></p>
      </body>
    </html>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/medicare_hub";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Database connected successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 MediCare Hub Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
      console.log(`📡 API Health: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB connection error:", err.message);
    console.log("ℹ️ Starting Express server with in-memory fallback. Ensure MongoDB is running or configure MONGODB_URI in server/.env");
    app.listen(PORT, () => {
      console.log(`🚀 MediCare Hub Server running on http://localhost:${PORT} (offline DB mode)`);
    });
  });
