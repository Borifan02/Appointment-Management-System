// src/components/patient/PatientPortalView.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  toISODate,
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG,
  downloadICS
} from "../../utils/calendarUtils";

const PatientPortalView = () => {
  const {
    appointments,
    currentRole,
    setCurrentView,
    openDetailModal,
    openReceiptModal
  } = useAppointments();

  const todayStr = toISODate(new Date());

  // Filter appointments belonging to this patient by email or name match
  const patientEmail = currentRole?.clientEmail || "eleanor.vance@example.com";
  const patientAppointments = appointments.filter((a) => {
    return (
      (a.email && a.email.toLowerCase() === patientEmail.toLowerCase()) ||
      (a.clientName && a.clientName.toLowerCase().includes("eleanor"))
    );
  }).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  // Next upcoming appointment
  const nextAppointment = patientAppointments
    .filter((a) => a.date >= todayStr && a.status !== "cancelled")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))[0];

  return (
    <div className="patient-portal-container">
      {/* Welcome Banner */}
      <div className="patient-welcome-card">
        <div className="patient-profile-header">
          <img src={currentRole?.avatar} alt={currentRole?.name} className="patient-hero-avatar" />
          <div className="patient-profile-text">
            <h2>Welcome back, {currentRole?.name}! 👋</h2>
            <p className="patient-account-meta">
              <span>Patient Account: <strong>MED-PAT-4402</strong></span>
              <span>Email: <strong>{patientEmail}</strong></span>
              <span>Portal Status: <strong className="text-success">Verified Active</strong></span>
            </p>
          </div>
        </div>
        <div className="patient-quick-actions">
          <button className="btn btn-primary" onClick={() => setCurrentView("booking")}>
            <span>➕</span> Book New Consultation
          </button>
        </div>
      </div>

      {/* Primary Upcoming Appointment Highlight */}
      {nextAppointment ? (
        <div className="patient-upcoming-highlight">
          <div className="upcoming-highlight-header">
            <div className="badge-featured">⭐ NEXT UPCOMING APPOINTMENT</div>
            <span className="ref-tag font-mono">{nextAppointment.referenceCode}</span>
          </div>

          <div className="upcoming-highlight-body">
            <div className="highlight-date-col">
              <span className="hl-month">
                {new Date(nextAppointment.date + "T00:00:00").toLocaleString("en-US", { month: "short" })}
              </span>
              <span className="hl-day">{nextAppointment.date.split("-")[2]}</span>
              <span className="hl-year">{nextAppointment.date.split("-")[0]}</span>
              <span className="hl-time font-mono">{formatReadableTime(nextAppointment.time)}</span>
            </div>

            <div className="highlight-details-col">
              <h3 className="hl-service-title">{nextAppointment.serviceName}</h3>
              <p className="hl-doctor-text">
                Specialist: <strong>{nextAppointment.specialistName}</strong>
              </p>
              <div className="hl-meta-pills">
                <span>📍 Location: {nextAppointment.room || "Suite 101"}</span>
                <span>⏱️ Duration: {nextAppointment.duration || 30} mins</span>
                <span>💵 Consultation Fee: ${nextAppointment.price}</span>
              </div>
              {nextAppointment.notes && (
                <div className="hl-notes-box">
                  <span className="notes-label">Your Intake Notes:</span>
                  <p>{nextAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="highlight-actions-col">
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={() => downloadICS(nextAppointment)}
                title="Add to Google Calendar, Apple Calendar or Outlook"
              >
                📅 Add to Calendar (.ICS)
              </button>
              <button
                className="btn btn-outline btn-sm btn-block"
                onClick={() => openReceiptModal(nextAppointment)}
              >
                🖨️ View & Print Pass
              </button>
              <button
                className="btn btn-secondary btn-sm btn-block"
                onClick={() => openDetailModal(nextAppointment)}
              >
                👁️ View Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="empty-patient-upcoming">
          <span className="empty-icon">🗓️</span>
          <h3>No Upcoming Appointments Scheduled</h3>
          <p>You have no active visits lined up. Book a new appointment anytime with our specialists.</p>
          <button className="btn btn-primary" onClick={() => setCurrentView("booking")}>
            Schedule a Consultation Now →
          </button>
        </div>
      )}

      {/* Patient Visits History Table */}
      <div className="patient-history-card">
        <div className="history-header">
          <h3>📋 Your Complete Visit History ({patientAppointments.length})</h3>
          <span className="text-muted text-sm">Records associated with your patient account</span>
        </div>

        {patientAppointments.length === 0 ? (
          <p className="no-history-text">No past visit history found for this account.</p>
        ) : (
          <div className="table-responsive-wrapper">
            <table className="medicare-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Service</th>
                  <th>Physician</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patientAppointments.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <tr key={apt.id}>
                      <td>
                        <span className="ref-badge">{apt.referenceCode}</span>
                      </td>
                      <td>
                        <strong>{apt.serviceName}</strong>
                        <div className="text-xs text-muted">${apt.price} • {apt.duration || 30} mins</div>
                      </td>
                      <td>
                        <span>{apt.specialistName}</span>
                        <div className="text-xs text-muted">📍 {apt.room}</div>
                      </td>
                      <td>
                        <div>{formatReadableDate(apt.date)}</div>
                        <div className="text-xs font-mono text-muted">{formatReadableTime(apt.time)}</div>
                      </td>
                      <td>
                        <span
                          className="status-pill-small"
                          style={{
                            backgroundColor: statusInfo.bgColor,
                            color: statusInfo.color
                          }}
                        >
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="row-actions">
                          <button
                            className="btn-icon-action"
                            onClick={() => downloadICS(apt)}
                            title="Download Calendar Pass (.ics)"
                          >
                            📅
                          </button>
                          <button
                            className="btn-icon-action"
                            onClick={() => openReceiptModal(apt)}
                            title="Print Visit Pass"
                          >
                            🖨️
                          </button>
                          <button
                            className="btn-icon-action"
                            onClick={() => openDetailModal(apt)}
                            title="View Record Details"
                          >
                            👁️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Clinic Helpdesk Footer Card */}
      <div className="patient-helpdesk-card">
        <div className="helpdesk-icon">🏥</div>
        <div className="helpdesk-info">
          <h4>MediCare Hub Medical Center • Patient Concierge</h4>
          <p>Need assistance or have an urgent medical query? Contact our 24/7 reception desk at <strong>+1 (555) 800-CARE</strong> or visit Room 100.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientPortalView;
