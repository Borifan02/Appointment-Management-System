// src/components/layout/Navbar.js
import React, { useState, useRef, useEffect } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { SYSTEM_ROLES } from "../../data/roles";

const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const {
    darkMode,
    setDarkMode,
    setCurrentView,
    loadDemoData,
    appointments,
    currentRole,
    switchRole,
    openAuthModal
  } = useAppointments();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

  const handleRoleSelect = (roleKey) => {
    switchRole(roleKey);
    setIsRoleDropdownOpen(false);
  };

  return (
    <header className="main-navbar">
      <div className="navbar-left">
        <button
          className="mobile-menu-btn"
          onClick={onToggleMobileMenu}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? "✕" : "☰"}
        </button>
        <div
          className="brand"
          onClick={() => setCurrentView(currentRole.defaultView || "dashboard")}
          role="button"
          tabIndex={0}
        >
          <div className="brand-logo-icon">
            <span>📅</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">
              MediCare<span className="brand-highlight">Hub</span>
            </span>
            <span className="brand-subtitle">Clinical Appointment System</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="date-badge">
          <span className="calendar-icon">🗓️</span>
          <span>Today: <strong>{todayStr}</strong></span>
          <span className="pill-count">{appointments.length} Bookings</span>
        </div>
      </div>

      <div className="navbar-right">
        {/* Interactive Persona / Role Switcher */}
        <div className="role-switcher-container" ref={dropdownRef}>
          <button
            className="role-switcher-btn"
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            title="Switch active user role to test role-based access control (Admin, Doctor, Receptionist, Patient)"
            aria-label="Switch Role"
          >
            <img src={currentRole.avatar} alt={currentRole.name} className="role-avatar-tiny" />
            <div className="role-btn-text">
              <span className="role-name-tiny">{currentRole.name}</span>
              <span className={`role-badge-chip ${currentRole.badgeClass}`}>
                {currentRole.icon} {currentRole.id.toUpperCase()}
              </span>
            </div>
            <span className="role-chevron">{isRoleDropdownOpen ? "▲" : "▼"}</span>
          </button>

          {isRoleDropdownOpen && (
            <div className="role-dropdown-menu animate-slide-in">
              <div className="dropdown-menu-header">
                <span className="header-label">ACTIVE ROLE (RBAC SIMULATOR)</span>
                <span className="header-sub">Click any role to test its permissions</span>
              </div>

              <div className="role-options-list">
                {Object.values(SYSTEM_ROLES).map((role) => {
                  const isSelected = currentRole.id === role.id;
                  return (
                    <div
                      key={role.id}
                      className={`role-option-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <img src={role.avatar} alt={role.name} className="role-option-avatar" />
                      <div className="role-option-details">
                        <div className="role-option-title-row">
                          <span className="role-option-name">{role.name}</span>
                          <span className={`role-badge-chip ${role.badgeClass}`}>
                            {role.icon} {role.id.toUpperCase()}
                          </span>
                        </div>
                        <p className="role-option-desc">{role.description}</p>
                      </div>
                      {isSelected && <span className="role-selected-check">✓</span>}
                    </div>
                  );
                })}
              </div>

              <div className="dropdown-menu-footer">
                <button
                  type="button"
                  className="dropdown-auth-btn"
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    openAuthModal("login");
                  }}
                >
                  <span>🔑</span> Sign In With Password
                </button>
                <button
                  type="button"
                  className="dropdown-auth-btn secondary"
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    openAuthModal("register");
                  }}
                >
                  <span>📝</span> Register Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Sign In / Auth Button */}
        <button
          className="btn-pill btn-auth-pill"
          onClick={() => openAuthModal("login")}
          title="Sign in or register a new user account"
        >
          <span>🔑</span> Sign In
        </button>

        {/* Demo Data button (Admin / Staff) */}
        {currentRole.id !== "patient" && (
          <button
            className="btn-pill btn-demo-pill"
            onClick={loadDemoData}
            title="Reset & populate realistic demo appointments"
          >
            <span>✨</span> Sample Data
          </button>
        )}

        <button
          className="btn-pill btn-primary-pill"
          onClick={() => setCurrentView("booking")}
        >
          <span>➕</span> New Booking
        </button>

        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          aria-label="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
