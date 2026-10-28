// src/components/dashboard/DashboardOverview.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { toISODate, formatReadableTime, STATUS_CONFIG } from "../../utils/calendarUtils";
import { exportAppointmentsToCSV } from "../../utils/exportUtils";

const DashboardOverview = () => {
  const {
    appointments,
    specialists,
    currentRole,
    hasPermission,
    setCurrentView,
    openDetailModal,
    updateStatus,
    loadDemoData
  } = useAppointments();

  const todayStr = toISODate(new Date());

  // Filter appointments if active role is a Doctor
  const roleFilteredAppointments = currentRole.specialistId
    ? appointments.filter((a) => a.specialistId === currentRole.specialistId)
    : appointments;

  // Metrics
  const total = roleFilteredAppointments.length;
  const todayApts = roleFilteredAppointments.filter((a) => a.date === todayStr);
  const completedApts = roleFilteredAppointments.filter((a) => a.status === "completed");
  const pendingApts = roleFilteredAppointments.filter((a) => a.status === "pending");
  const confirmedApts = roleFilteredAppointments.filter((a) => a.status === "confirmed");
  const cancelledApts = roleFilteredAppointments.filter((a) => a.status === "cancelled");

  // Estimated Revenue: Only calculated if role has financial visibility
  const totalRevenue = roleFilteredAppointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const completionRate = total > 0 ? Math.round((completedApts.length / total) * 100) : 0;

  // Today's appointments sorted by time
  const sortedTodayApts = [...todayApts].sort((a, b) => a.time.localeCompare(b.time));

  // Upcoming appointments (dates > today)
  const upcomingApts = roleFilteredAppointments
    .filter((a) => a.date > todayStr && a.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const kpis = [
    {
      title: currentRole.id === "doctor" ? "Your Total Patients" : "Total Bookings",
      value: total,
      subtext: `${confirmedApts.length} confirmed, ${pendingApts.length} pending`,
      icon: "📊",
      borderAccent: "#3b82f6"
    },
    {
      title: "Today's Schedule",
      value: todayApts.length,
      subtext: `${todayApts.filter((a) => a.status === "completed").length} completed visits`,
      icon: "🗓️",
      borderAccent: "#10b981"
    },
    hasPermission("canViewFinancials")
      ? {
          title: "Booked Revenue",
          value: `$${totalRevenue.toLocaleString()}`,
          subtext: "From confirmed & completed",
          icon: "💵",
          borderAccent: "#8b5cf6"
        }
      : {
          title: "Pending Confirmations",
          value: pendingApts.length,
          subtext: "Action required",
          icon: "⏳",
          borderAccent: "#8b5cf6"
        },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      subtext: `${cancelledApts.length} cancellations`,
      icon: "🎯",
      borderAccent: "#f59e0b"
    }
  ];

  return (
    <div className="dashboard-overview">
      {/* Header Banner */}
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="hero-role-tag">
            <span className={`role-badge-chip ${currentRole.badgeClass}`}>
              {currentRole.icon} ACTIVE VIEW: {currentRole.roleLabel.toUpperCase()}
            </span>
          </div>
          <h2>
            {currentRole.id === "doctor"
              ? `Physician Clinical Schedule — ${currentRole.name}`
              : "Clinical Operations Overview"}
          </h2>
          <p>
            {currentRole.id === "doctor"
              ? "Displaying personal consultations, patient medical records, and diagnostic schedule."
              : "Real-time patient appointments, clinical schedule, and performance indicators."}
          </p>
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView("booking")}>
            <span>➕</span> Book Appointment
          </button>
          <button
            className="btn btn-outline"
            onClick={() => exportAppointmentsToCSV(roleFilteredAppointments, `appointments_export_${todayStr}.csv`)}
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="kpi-card" style={{ borderTop: `4px solid ${kpi.borderAccent}` }}>
            <div className="kpi-top">
              <span className="kpi-title">{kpi.title}</span>
              <span className="kpi-icon">{kpi.icon}</span>
            </div>
            <div className="kpi-value">{kpi.value}</div>
            <div className="kpi-subtext">{kpi.subtext}</div>
          </div>
        ))}
      </div>

      {/* Main Two-Column Layout */}
      <div className="dashboard-main-columns">
        {/* Left Column: Today's Schedule */}
        <div className="dashboard-card today-schedule-card">
          <div className="card-header">
            <div className="card-header-left">
              <h3>🕒 Today's Schedule ({sortedTodayApts.length})</h3>
              <span className="card-subtitle">
                {currentRole.id === "doctor" ? "Your patients scheduled for today" : "Patients scheduled for today across all doctors"}
              </span>
            </div>
            <button className="btn-link" onClick={() => setCurrentView("calendar")}>
              Open Full Calendar →
            </button>
          </div>

          <div className="card-body">
            {sortedTodayApts.length === 0 ? (
              <div className="empty-schedule-box">
                <span className="empty-icon">📭</span>
                <h4>No appointments scheduled for today</h4>
                <p>Schedule a client for today or load sample data to test workflows.</p>
                <div className="empty-buttons">
                  <button className="btn btn-primary btn-sm" onClick={() => setCurrentView("booking")}>
                    Schedule Patient Now
                  </button>
                  {currentRole.id === "admin" && (
                    <button className="btn btn-secondary btn-sm" onClick={loadDemoData}>
                      Load Sample Data
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="today-timeline">
                {sortedTodayApts.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <div key={apt.id} className="timeline-item" onClick={() => openDetailModal(apt)}>
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
                          <span className="meta-service">🩺 {apt.serviceName}</span>
                          <span className="meta-doctor">👨‍⚕️ {apt.specialistName}</span>
                          <span className="meta-room">📍 {apt.room || "Room 101"}</span>
                        </div>
                      </div>
                      <div className="timeline-actions" onClick={(e) => e.stopPropagation()}>
                        {apt.status === "pending" && (
                          <button
                            className="btn-action-icon btn-action-confirm"
                            title="Confirm appointment"
                            onClick={() => updateStatus(apt.id, "confirmed")}
                          >
                            ✓
                          </button>
                        )}
                        {apt.status === "confirmed" && (
                          <button
                            className="btn-action-icon btn-action-progress"
                            title="Mark In-Progress"
                            onClick={() => updateStatus(apt.id, "in-progress")}
                          >
                            ▶
                          </button>
                        )}
                        {apt.status === "in-progress" && (
                          <button
                            className="btn-action-icon btn-action-complete"
                            title="Mark Completed"
                            onClick={() => updateStatus(apt.id, "completed")}
                          >
                            ✅
                          </button>
                        )}
                        <button
                          className="btn-action-icon"
                          title="View Details"
                          onClick={() => openDetailModal(apt)}
                        >
                          👁️
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Specialists on Duty & Upcoming */}
        <div className="dashboard-right-column">
          {/* Specialists Roster Card (Only visible to admin and receptionist) */}
          {currentRole.id !== "doctor" && (
            <div className="dashboard-card specialists-preview-card">
              <div className="card-header">
                <h3>👨‍⚕️ Specialists on Duty</h3>
                <button className="btn-link" onClick={() => setCurrentView("roster")}>
                  View Roster →
                </button>
              </div>
              <div className="specialists-mini-list">
                {specialists.slice(0, 4).map((spec) => {
                  const specTodayCount = todayApts.filter((a) => a.specialistId === spec.id).length;
                  return (
                    <div key={spec.id} className="specialist-mini-item">
                      <img src={spec.avatar} alt={spec.name} className="specialist-avatar-sm" />
                      <div className="specialist-info">
                        <h4 className="specialist-name">{spec.name}</h4>
                        <p className="specialist-role">{spec.specialty}</p>
                      </div>
                      <div className="specialist-stats">
                        <span className="badge-stat">{specTodayCount} today</span>
                        <span className="rating-badge">★ {spec.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upcoming Appointments Card */}
          <div className="dashboard-card upcoming-card">
            <div className="card-header">
              <h3>📅 Next Upcoming ({upcomingApts.length})</h3>
              <button className="btn-link" onClick={() => setCurrentView("appointments")}>
                All Registry →
              </button>
            </div>
            <div className="upcoming-list">
              {upcomingApts.length === 0 ? (
                <p className="no-upcoming-msg">No future bookings recorded yet.</p>
              ) : (
                upcomingApts.map((apt) => (
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

export default DashboardOverview;
