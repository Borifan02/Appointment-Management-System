// src/components/dashboard/ReceptionistDashboard.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  toISODate,
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG
} from "../../utils/calendarUtils";

const ReceptionistDashboard = () => {
  const {
    appointments,
    specialists,
    openDetailModal,
    openReceiptModal,
    updateStatus,
    setCurrentView
  } = useAppointments();

  const todayStr = toISODate(new Date());

  // Today's appointments across all doctors
  const todayApts = appointments
    .filter((a) => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const checkedInToday = todayApts.filter(
    (a) => a.status === "confirmed" || a.status === "in-progress"
  ).length;
  const inProgressToday = todayApts.filter((a) => a.status === "in-progress").length;
  const pendingCheckInToday = todayApts.filter((a) => a.status === "pending").length;
  const completedToday = todayApts.filter((a) => a.status === "completed").length;

  return (
    <div className="receptionist-dashboard-container">
      {/* Front Desk Hero Banner */}
      <div className="receptionist-hero-banner">
        <div className="receptionist-hero-text">
          <div className="badge-receptionist">📋 FRONT DESK & RECEPTION CONCIERGE</div>
          <h2>Patient Intake & Check-In Desk</h2>
          <p>Manage daily patient arrivals, room assignments, print official visit passes, and handle walk-ins.</p>
        </div>

        <div className="receptionist-hero-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView("booking")}>
            <span>➕</span> New Patient Walk-In
          </button>
          <button className="btn btn-secondary" onClick={() => setCurrentView("appointments")}>
            <span>📋</span> Search All Registry
          </button>
        </div>
      </div>

      {/* Front Desk Queue KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTop: "4px solid #3b82f6" }}>
          <div className="kpi-top">
            <span className="kpi-title">Today's Arrivals</span>
            <span className="kpi-icon">🚪</span>
          </div>
          <div className="kpi-value">{todayApts.length}</div>
          <div className="kpi-subtext">Total expected today</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #f59e0b" }}>
          <div className="kpi-top">
            <span className="kpi-title">Pending Check-In</span>
            <span className="kpi-icon">⏳</span>
          </div>
          <div className="kpi-value">{pendingCheckInToday}</div>
          <div className="kpi-subtext">Awaiting arrival</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #8b5cf6" }}>
          <div className="kpi-top">
            <span className="kpi-title">In Examination Room</span>
            <span className="kpi-icon">🩺</span>
          </div>
          <div className="kpi-value">{inProgressToday}</div>
          <div className="kpi-subtext">Currently with doctors</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #10b981" }}>
          <div className="kpi-top">
            <span className="kpi-title">Completed Departures</span>
            <span className="kpi-icon">✅</span>
          </div>
          <div className="kpi-value">{completedToday}</div>
          <div className="kpi-subtext">{checkedInToday} checked in so far</div>
        </div>
      </div>

      {/* Main Front Desk Two-Column Layout */}
      <div className="dashboard-main-columns">
        {/* Left: Patient Arrival Queue */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>🕒 Today's Check-In & Arrival Queue ({todayApts.length})</h3>
              <span className="card-subtitle">
                Scheduled visits for {formatReadableDate(todayStr)}
              </span>
            </div>
            <button className="btn-link" onClick={() => setCurrentView("calendar")}>
              Calendar Grid →
            </button>
          </div>

          <div className="card-body">
            {todayApts.length === 0 ? (
              <div className="empty-schedule-box">
                <span className="empty-icon">📭</span>
                <h4>No patient arrivals recorded for today</h4>
                <p>Register a new patient walk-in using the booking button.</p>
              </div>
            ) : (
              <div className="today-timeline">
                {todayApts.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={apt.id} className="timeline-item">
                      <div className="timeline-time">
                        <span className="time-primary">{formatReadableTime(apt.time)}</span>
                        <span className="time-duration">{apt.duration || 30} mins</span>
                      </div>
                      <div className="timeline-dot" style={{ backgroundColor: statusInfo.color }} />
                      <div className="timeline-content">
                        <div className="timeline-title-row">
                          <h4 className="client-name">{apt.clientName || apt.name}</h4>
                          <span
                            className="status-pill"
                            style={{
                              backgroundColor: statusInfo.bgColor,
                              color: statusInfo.color,
                              borderColor: statusInfo.borderColor
                            }}
                          >
                            {statusInfo.label}
                          </span>
                          <span className="ref-badge font-mono">{apt.referenceCode}</span>
                        </div>
                        <div className="timeline-meta">
                          <span>👨‍⚕️ {apt.specialistName}</span>
                          <span>•</span>
                          <span>📍 Room: <strong>{apt.room || "Suite 101"}</strong></span>
                          <span>•</span>
                          <span>📞 {apt.phone || "N/A"}</span>
                        </div>
                      </div>

                      <div className="timeline-actions">
                        {apt.status === "pending" && (
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => updateStatus(apt.id, "confirmed")}
                            title="Check in patient"
                          >
                            ✓ Check-In
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openReceiptModal(apt)}
                          title="Print official visit slip / barcode pass"
                        >
                          🖨️ Print Pass
                        </button>
                        <button
                          className="btn btn-secondary btn-xs"
                          onClick={() => openDetailModal(apt)}
                          title="View Details"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Doctor Rooms & Active Locations */}
        <div className="dashboard-right-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📍 Physician Room Directory</h3>
              <button className="btn-link" onClick={() => setCurrentView("roster")}>
                Full Directory →
              </button>
            </div>
            <div className="specialists-mini-list">
              {specialists.map((spec) => {
                const specActiveToday = todayApts.filter(
                  (a) => a.specialistId === spec.id && a.status === "in-progress"
                ).length;
                return (
                  <div key={spec.id} className="specialist-mini-item">
                    <img src={spec.avatar} alt={spec.name} className="specialist-avatar-sm" />
                    <div className="specialist-info">
                      <h4 className="specialist-name">{spec.name}</h4>
                      <p className="specialist-role">📍 {spec.room}</p>
                    </div>
                    <div className="specialist-stats">
                      {specActiveToday > 0 ? (
                        <span className="badge-stat" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                          In Consultation
                        </span>
                      ) : (
                        <span className="text-xs text-muted">Available</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
