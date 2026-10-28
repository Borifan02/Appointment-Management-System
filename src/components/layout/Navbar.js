// src/components/layout/Navbar.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";

const Navbar = ({ onToggleMobileMenu, isMobileMenuOpen }) => {
  const { darkMode, setDarkMode, setCurrentView, loadDemoData, appointments } = useAppointments();

  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  });

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
        <div className="brand" onClick={() => setCurrentView("dashboard")} role="button" tabIndex={0}>
          <div className="brand-logo-icon">
            <span>📅</span>
          </div>
          <div className="brand-text">
            <span className="brand-title">MediCare<span className="brand-highlight">Hub</span></span>
            <span className="brand-subtitle">Clinical Appointment System</span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="date-badge">
          <span className="calendar-icon">🗓️</span>
          <span>Today: <strong>{todayStr}</strong></span>
          <span className="pill-count">{appointments.length} Appointments</span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="btn-pill btn-demo-pill"
          onClick={loadDemoData}
          title="Reset & populate realistic demo appointments across multiple doctors"
        >
          <span>✨</span> Load Sample Data
        </button>

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
