// src/components/auth/AuthModal.js
import React, { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { SYSTEM_ROLES } from "../../data/roles";

const AuthModal = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    login,
    signup,
    switchRole,
    authModalTab,
    setAuthModalTab
  } = useAppointments();

  // Login Form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Register Form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regRole, setRegRole] = useState("patient");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regErrors, setRegErrors] = useState({});

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    const res = login(loginEmail, loginPassword);
    if (res.success) {
      closeAuthModal();
    } else {
      setLoginError(res.message || "Invalid email or password.");
    }
  };

  const handleQuickDemoLogin = (roleKey) => {
    switchRole(roleKey);
    closeAuthModal();
  };

  const validateRegister = () => {
    const errs = {};
    if (!regName.trim()) errs.name = "Full name is required";
    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail)) errs.email = "Valid email is required";
    if (!regPhone || regPhone.replace(/\D/g, "").length < 7) errs.phone = "Valid contact phone is required";
    if (!regPassword || regPassword.length < 6) errs.password = "Password must be at least 6 characters";
    if (regPassword !== regConfirmPassword) errs.confirmPassword = "Passwords do not match";
    setRegErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    const res = signup({
      name: regName,
      email: regEmail,
      phone: regPhone,
      role: regRole,
      password: regPassword
    });

    if (res.success) {
      closeAuthModal();
    }
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!regPassword) return { label: "", color: "" };
    if (regPassword.length < 6) return { label: "Weak", color: "#ef4444" };
    if (regPassword.length < 9) return { label: "Medium", color: "#f59e0b" };
    return { label: "Strong", color: "#10b981" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-card auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Auth Brand Header */}
        <div className="auth-modal-header">
          <div className="auth-brand-row">
            <span className="auth-brand-logo">📅</span>
            <div>
              <h3>MediCare Hub Authentication</h3>
              <p>Secure Role-Based Clinical Access</p>
            </div>
          </div>
          <button className="btn-modal-close" onClick={closeAuthModal}>
            ×
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tabs-row">
          <button
            type="button"
            className={`auth-tab-btn ${authModalTab === "login" ? "active" : ""}`}
            onClick={() => {
              setAuthModalTab("login");
              setLoginError("");
            }}
          >
            Sign In (Login)
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${authModalTab === "register" ? "active" : ""}`}
            onClick={() => {
              setAuthModalTab("register");
              setRegErrors({});
            }}
          >
            Create New Account
          </button>
        </div>

        <div className="modal-body auth-modal-body">
          {/* Sign In Tab */}
          {authModalTab === "login" && (
            <div className="auth-form-wrap">
              {loginError && <div className="alert-auth-error">⚠️ {loginError}</div>}

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group mb-3">
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@medicare.com"
                    className="form-input"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="form-group mb-3">
                  <div className="label-with-action">
                    <label className="input-label">Password *</label>
                    <button
                      type="button"
                      className="btn-link-subtle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block mb-3">
                  Sign In to Workspace →
                </button>
              </form>

              {/* 1-Click Fast Demo Login for Portfolio Reviewers */}
              <div className="auth-divider">
                <span>OR SIGN IN INSTANTLY WITH A DEMO PERSONA</span>
              </div>

              <div className="demo-accounts-grid">
                {Object.values(SYSTEM_ROLES).map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    className="btn-demo-account-login"
                    onClick={() => handleQuickDemoLogin(role.id)}
                    title={`Log in as ${role.name} (${role.roleLabel})`}
                  >
                    <img src={role.avatar} alt={role.name} className="demo-login-avatar" />
                    <div className="demo-login-text">
                      <span className="demo-name">{role.name}</span>
                      <span className="demo-role-tag">{role.icon} {role.roleLabel}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create Account Tab */}
          {authModalTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="auth-form-wrap">
              {/* Patient Notice Banner */}
              <div className="auth-register-banner mb-3">
                <div className="banner-title-row">
                  <span className="badge-pill-cyan">👤 Patient Portal Self-Registration</span>
                </div>
                <p className="banner-subtext">
                  Register for instant 24/7 online consultation booking, visit calendar passes (.ICS), and personal visit history.
                </p>
                <div className="staff-security-callout">
                  <span>🔒</span>
                  <span><strong>Are you a Physician or Clinic Staff?</strong> Staff accounts are provisioned exclusively by the Clinic Administrator.</span>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-label">Account Category</label>
                <div className="role-selector-radios">
                  <label className={`radio-pill ${regRole === "patient" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={regRole === "patient"}
                      onChange={() => setRegRole("patient")}
                    />
                    <span>👤 Patient Account (Public)</span>
                  </label>
                  <label className={`radio-pill ${regRole === "doctor" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="role"
                      value="doctor"
                      checked={regRole === "doctor"}
                      onChange={() => setRegRole("doctor")}
                    />
                    <span>👨‍⚕️ Doctor (Testing)</span>
                  </label>
                  <label className={`radio-pill ${regRole === "receptionist" ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="role"
                      value="receptionist"
                      checked={regRole === "receptionist"}
                      onChange={() => setRegRole("receptionist")}
                    />
                    <span>📋 Staff (Testing)</span>
                  </label>
                </div>
              </div>

              <div className="form-group mb-3">
                <label className="input-label">Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Alexander Vance"
                  className={`form-input ${regErrors.name ? "input-error" : ""}`}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
                {regErrors.name && <span className="error-text">{regErrors.name}</span>}
              </div>

              <div className="form-group-row mb-3">
                <div className="form-group flex-1">
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    className={`form-input ${regErrors.email ? "input-error" : ""}`}
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                  />
                  {regErrors.email && <span className="error-text">{regErrors.email}</span>}
                </div>

                <div className="form-group flex-1">
                  <label className="input-label">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={`form-input ${regErrors.phone ? "input-error" : ""}`}
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                  />
                  {regErrors.phone && <span className="error-text">{regErrors.phone}</span>}
                </div>
              </div>

              <div className="form-group-row mb-3">
                <div className="form-group flex-1">
                  <label className="input-label">Create Password *</label>
                  <input
                    type="password"
                    placeholder="At least 6 characters"
                    className={`form-input ${regErrors.password ? "input-error" : ""}`}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                  {strength.label && (
                    <span className="strength-indicator" style={{ color: strength.color }}>
                      Strength: {strength.label}
                    </span>
                  )}
                  {regErrors.password && <span className="error-text">{regErrors.password}</span>}
                </div>

                <div className="form-group flex-1">
                  <label className="input-label">Confirm Password *</label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    className={`form-input ${regErrors.confirmPassword ? "input-error" : ""}`}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                  />
                  {regErrors.confirmPassword && (
                    <span className="error-text">{regErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block">
                Complete Registration & Sign In →
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
