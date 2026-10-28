// src/components/dashboard/DoctorDashboard.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  toISODate,
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG
} from "../../utils/calendarUtils";

const DoctorDashboard = () => {
  const {
    appointments,
    currentRole,
    specialists,
    openDetailModal,
    updateStatus,
    setCurrentView
  } = useAppointments();

  const todayStr = toISODate(new Date());

  // Doctor's specialist profile
  const doctorSpecialist = specialists.find((s) => s.id === currentRole.specialistId) || {
    name: currentRole.name,
    specialty: "Internal Medicine & Primary Care",
    room: "Suite 101 - Building A",
    workingHours: { start: "08:30", end: "16:30" }
  };

  // Filter only Dr. Evelyn Reed's appointments
  const myAppointments = appointments.filter(
    (a) => a.specialistId === currentRole.specialistId || a.specialistName === currentRole.name
  );

  const myTodayApts = myAppointments
    .filter((a) => a.date === todayStr)
    .sort((a, b) => a.time.localeCompare(b.time));

  const myCompletedToday = myTodayApts.filter((a) => a.status === "completed").length;
  const myUpcomingApts = myAppointments
    .filter((a) => a.date > todayStr && a.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  // Next patient coming up today
  const nextPatientToday = myTodayApts.find(
    (a) => a.status === "confirmed" || a.status === "in-progress"
  );

  return (
    <div className="doctor-dashboard-container">
      {/* Physician Hero Banner */}
      <div className="doctor-hero-banner">
        <div className="doctor-hero-profile">
          <img
            src={currentRole.avatar}
            alt={currentRole.name}
            className="doctor-hero-avatar"
          />
          <div className="doctor-hero-info">
            <div className="badge-physician">👨‍⚕️ PHYSICIAN CLINICAL WORKSPACE</div>
            <h2>{currentRole.name}</h2>
            <p className="doctor-meta-line">
              <span>Specialty: <strong>{doctorSpecialist.specialty}</strong></span>
              <span>•</span>
              <span>Room: <strong>{doctorSpecialist.room}</strong></span>
              <span>•</span>
              <span>Duty Hours: <strong>{doctorSpecialist.workingHours?.start} - {doctorSpecialist.workingHours?.end}</strong></span>
            </p>
          </div>
        </div>

        <div className="doctor-quick-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView("calendar")}>
            <span>📅</span> View My Full Schedule
          </button>
        </div>
      </div>

      {/* Physician Clinical Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTop: "4px solid #10b981" }}>
          <div className="kpi-top">
            <span className="kpi-title">Today's Patients</span>
            <span className="kpi-icon">📋</span>
          </div>
          <div className="kpi-value">{myTodayApts.length}</div>
          <div className="kpi-subtext">{myCompletedToday} completed today</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #3b82f6" }}>
          <div className="kpi-top">
            <span className="kpi-title">Total Caseload</span>
            <span className="kpi-icon">👥</span>
          </div>
          <div className="kpi-value">{myAppointments.length}</div>
          <div className="kpi-subtext">Patients under your care</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #8b5cf6" }}>
          <div className="kpi-top">
            <span className="kpi-title">Upcoming Visits</span>
            <span className="kpi-icon">🗓️</span>
          </div>
          <div className="kpi-value">{myUpcomingApts.length}</div>
          <div className="kpi-subtext">Future booked consults</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #f59e0b" }}>
          <div className="kpi-top">
            <span className="kpi-title">Next In Line</span>
            <span className="kpi-icon">⏰</span>
          </div>
          <div className="kpi-value">
            {nextPatientToday ? formatReadableTime(nextPatientToday.time) : "None"}
          </div>
          <div className="kpi-subtext">
            {nextPatientToday ? nextPatientToday.clientName : "Schedule clear for now"}
          </div>
        </div>
      </div>

      {/* Main Clinical Columns */}
      <div className="dashboard-main-columns">
        {/* Left: Today's Clinical Schedule */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>🩺 Today's Patient Consultation Queue ({myTodayApts.length})</h3>
              <span className="card-subtitle">
                Scheduled consultations for today ({formatReadableDate(todayStr)})
              </span>
            </div>
          </div>

          <div className="card-body">
            {myTodayApts.length === 0 ? (
              <div className="empty-schedule-box">
                <span className="empty-icon">☕</span>
                <h4>No consultations scheduled for today</h4>
                <p>Your schedule for today is currently clear.</p>
              </div>
            ) : (
              <div className="today-timeline">
                {myTodayApts.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <div
                      key={apt.id}
                      className="timeline-item"
                      onClick={() => openDetailModal(apt)}
                    >
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
                        </div>
                        <div className="timeline-meta">
                          <span className="meta-service">Service: <strong>{apt.serviceName}</strong></span>
                          <span>•</span>
                          <span className="meta-contact">📞 {apt.phone || "No phone"}</span>
                        </div>
                        {apt.notes && (
                          <div className="doctor-note-snippet">
                            <span>📝 Notes:</span> {apt.notes}
                          </div>
                        )}
                      </div>
                      <div className="timeline-actions" onClick={(e) => e.stopPropagation()}>
                        {apt.status === "confirmed" && (
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => updateStatus(apt.id, "in-progress")}
                            title="Start Consultation"
                          >
                            ▶ Call In
                          </button>
                        )}
                        {apt.status === "in-progress" && (
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => updateStatus(apt.id, "completed")}
                            title="Complete Consultation"
                          >
                            ✅ Complete
                          </button>
                        )}
                        <button
                          className="btn btn-outline btn-xs"
                          onClick={() => openDetailModal(apt)}
                        >
                          Clinical Notes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Upcoming Patient Caseload */}
        <div className="dashboard-right-column">
          <div className="dashboard-card">
            <div className="card-header">
              <h3>📅 Next Upcoming Patients ({myUpcomingApts.length})</h3>
              <button className="btn-link" onClick={() => setCurrentView("appointments")}>
                View Registry →
              </button>
            </div>
            <div className="upcoming-list">
              {myUpcomingApts.length === 0 ? (
                <p className="no-upcoming-msg">No upcoming patients booked yet.</p>
              ) : (
                myUpcomingApts.slice(0, 6).map((apt) => (
                  <div
                    key={apt.id}
                    className="upcoming-item"
                    onClick={() => openDetailModal(apt)}
                  >
                    <div className="upcoming-date-badge">
                      <span className="u-day">{apt.date.split("-")[2]}</span>
                      <span className="u-month">
                        {new Date(apt.date + "T00:00:00").toLocaleString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="upcoming-details">
                      <h4 className="u-client">{apt.clientName || apt.name}</h4>
                      <p className="u-service">
                        {apt.serviceName} • {formatReadableTime(apt.time)}
                      </p>
                    </div>
                    <span className={`badge ${STATUS_CONFIG[apt.status]?.badgeClass || "badge-pending"}`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
