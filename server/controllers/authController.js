// server/controllers/authController.js
const User = require("../models/User");

// Pre-seeded demo personas matching frontend SYSTEM_ROLES
const DEMO_PERSONAS = [
  {
    name: "Dr. Catherine Hayes",
    email: "admin@medicare.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
  },
  {
    name: "Dr. Evelyn Reed",
    email: "doctor.reed@medicare.com",
    role: "doctor",
    specialistId: "spec-1",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80"
  },
  {
    name: "Sarah Jenkins",
    email: "reception@medicare.com",
    role: "receptionist",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80"
  },
  {
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    role: "patient",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80"
  }
];

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists"
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || "",
      role: role || "patient"
    });

    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Registration failed"
    });
  }
};

// @desc    Login user with email & password
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email and password"
      });
    }

    // Check database for user
    let user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // If user not in MongoDB yet, check if it's one of the built-in demo accounts
    if (!user) {
      const demoPersona = DEMO_PERSONAS.find((d) => d.email.toLowerCase() === email.toLowerCase());
      if (demoPersona) {
        // Auto-provision demo account with default password
        user = await User.create({
          name: demoPersona.name,
          email: demoPersona.email,
          password: password || "DemoPassword123!",
          role: demoPersona.role,
          specialistId: demoPersona.specialistId,
          avatar: demoPersona.avatar
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Account not found."
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Incorrect password."
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Login failed"
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get available demo personas
// @route   GET /api/auth/demo-personas
// @access  Public
exports.getDemoPersonas = (req, res) => {
  res.status(200).json({
    success: true,
    data: DEMO_PERSONAS
  });
};

// @desc    Admin: Provision a new staff member (Doctor or Receptionist)
// @route   POST /api/auth/provision-staff
// @access  Private (Admin only)
exports.provisionStaff = async (req, res) => {
  try {
    const { name, email, password, phone, role, specialistId } = req.body;

    if (!["doctor", "receptionist"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Staff role must be either 'doctor' or 'receptionist'"
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists"
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: password || "StaffWelcome2026!",
      phone: phone || "",
      role,
      specialistId: role === "doctor" ? (specialistId || `spec-${Date.now()}`) : null,
      avatar:
        role === "doctor"
          ? "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=120&auto=format&fit=crop&q=80"
    });

    res.status(201).json({
      success: true,
      message: `Successfully provisioned ${role}: ${name}`,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialistId: user.specialistId
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message || "Failed to provision staff member"
    });
  }
};

// Helper function to get token from model, create cookie/JSON response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      specialistId: user.specialistId,
      avatar: user.avatar
    }
  });
};
