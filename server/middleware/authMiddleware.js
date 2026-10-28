// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - verify Bearer token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route (token missing)"
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "medicare_jwt_secret_dev"
    );

    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User associated with this token no longer exists"
      });
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route (invalid or expired token)"
    });
  }
};

// Grant access to specific roles (RBAC)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user ? req.user.role : "anonymous"}' is not authorized to perform this action`
      });
    }
    next();
  };
};
