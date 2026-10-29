// src/components/admin/AddStaffModal.js
import React, { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";

const SPECIALTY_OPTIONS = [
  "Internal Medicine & Primary Care",
  "Cardiology & Cardiovascular Care",
  "Dermatology & Skin Health",
  "Pediatrics & Child Health",
  "Orthopedics & Sports Medicine",
  "Neurology & Neuro-diagnostics",
  "Ophthalmology & Eye Care",
  "Dental Surgery & Orthodontics",
  "Physiotherapy & Rehabilitation"
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const AddStaffModal = () => {
  const {
    isAddStaffModalOpen,
    closeAddStaffModal,
    addStaffMember,
    hasPermission
  } = useAppointments();

  const [role, setRole] = useState("doctor"); // 'doctor' | 'receptionist'
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTY_OPTIONS[0]);
  const [room, setRoom] = useState("Suite 201 - East Wing");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("StaffPass2026!");
  const [errors, setErrors] = useState({});

  if (!isAddStaffModalOpen) return null;

  // Security guard - only admins can access this modal
  if (!hasPermission("canManageRoster")) {
    return null;
  }

  const toggleDay = (day) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const generateRandomPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let generated = "";
    for (let i = 0; i < 10; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generated);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Valid work email is required";
    if (!phone || phone.replace(/\D/g, "").length < 7) errs.phone = "Valid contact phone is required";
    if (!password || password.length < 6) errs.password = "Password must be at least 6 characters";
    if (role === "doctor" && !room.trim()) errs.room = "Room / Suite assignment is required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const res = addStaffMember({
      name,
      email,
      phone,
      role,
      password,
      specialty: role === "doctor" ? specialty : "Front Desk & Intake Operations",
      room: role === "doctor" ? room : "Reception Desk A",
      workingHours: { start: startTime, end: endTime },
      availableDays: selectedDays
    });

    if (res.success) {
      closeAddStaffModal();
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setPassword("StaffPass2026!");
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeAddStaffModal}>
      <div className="modal-card add-staff-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header staff-modal-header">
          <div className="staff-modal-header-text">
            <span className="staff-modal-badge">🛡️ ADMINISTRATOR STAFF PROVISIONING</span>
            <h3>Provision New Healthcare Staff</h3>
            <p>Create verified physician or front desk credentials and assign clinical schedule.</p>
          </div>
          <button className="btn-modal-close" onClick={closeAddStaffModal}>
            ×
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="modal-body staff-modal-body">
          {/* Role Switcher */}
          <div className="form-group mb-3">
            <label className="input-label">Select Staff Position *</label>
            <div className="staff-role-toggle-group">
              <button
                type="button"
                className={`staff-role-toggle-btn ${role === "doctor" ? "active" : ""}`}
                onClick={() => setRole("doctor")}
              >
                <span className="toggle-icon">👨‍⚕️</span>
                <div className="toggle-text">
                  <strong>Medical Doctor / Specialist</strong>
                  <span>Clinical consultations, patient queue & diagnosis</span>
                </div>
              </button>

              <button
                type="button"
                className={`staff-role-toggle-btn ${role === "receptionist" ? "active" : ""}`}
                onClick={() => setRole("receptionist")}
              >
                <span className="toggle-icon">📋</span>
                <div className="toggle-text">
                  <strong>Front Desk Receptionist</strong>
                  <span>Patient check-in, arrivals queue & visit slip printing</span>
                </div>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group mb-3">
            <label className="input-label">Staff Member Full Name *</label>
            <input
              type="text"
              className={`form-input ${errors.name ? "input-error" : ""}`}
              placeholder={role === "doctor" ? "e.g. Dr. Julian Croft, MD" : "e.g. Marcus Vance"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Doctor-Specific Fields: Specialty & Room */}
          {role === "doctor" && (
            <div className="form-group-row mb-3">
              <div className="form-group flex-1">
                <label className="input-label">Medical Specialty / Department *</label>
                <select
                  className="form-input"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                >
                  {SPECIALTY_OPTIONS.map((spec, i) => (
                    <option key={i} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group flex-1">
                <label className="input-label">Consultation Room / Suite *</label>
                <input
                  type="text"
                  className={`form-input ${errors.room ? "input-error" : ""}`}
                  placeholder="e.g. Suite 208 - Building B"
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
                {errors.room && <span className="error-text">{errors.room}</span>}
              </div>
            </div>
          )}

          {/* Doctor Duty Hours & Days */}
          {role === "doctor" && (
            <div className="form-group mb-3 staff-schedule-box">
              <label className="input-label">Operating Schedule & Clinical Hours</label>
              <div className="duty-hours-row mb-2">
                <div className="time-field-wrap">
                  <span className="field-sublabel">Duty Start</span>
                  <input
                    type="time"
                    className="form-input"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <span className="time-sep">➔</span>
                <div className="time-field-wrap">
                  <span className="field-sublabel">Duty End</span>
                  <input
                    type="time"
                    className="form-input"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="duty-days-selector">
                <span className="field-sublabel">Available Clinical Days:</span>
                <div className="days-pills-row">
                  {WEEK_DAYS.map((day) => (
                    <button
                      key={day}
                      type="button"
                      className={`day-pill ${selectedDays.includes(day) ? "selected" : ""}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="form-group-row mb-3">
            <div className="form-group flex-1">
              <label className="input-label">Official Work Email *</label>
              <input
                type="email"
                className={`form-input ${errors.email ? "input-error" : ""}`}
                placeholder="staff.name@medicare.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group flex-1">
              <label className="input-label">Contact Phone Number *</label>
              <input
                type="tel"
                className={`form-input ${errors.phone ? "input-error" : ""}`}
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>
          </div>

          {/* Password Provisioning */}
          <div className="form-group mb-4">
            <div className="label-with-action">
              <label className="input-label">Initial Password / Credentials *</label>
              <button
                type="button"
                className="btn-link-subtle"
                onClick={generateRandomPassword}
                title="Generate a random secure temporary password"
              >
                🎲 Generate Secure Password
              </button>
            </div>
            <input
              type="text"
              className={`form-input font-mono ${errors.password ? "input-error" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <span className="input-help-text">
              Provide this temporary password to the staff member. They will use this email and password to log into their workspace.
            </span>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer staff-modal-footer">
            <button type="button" className="btn btn-outline" onClick={closeAddStaffModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <span>🛡️</span> Issue Credentials & Add to Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;
