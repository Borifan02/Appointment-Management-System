// src/components/appointments/AppointmentDetailModal.js
import React, { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG,
  downloadICS
} from "../../utils/calendarUtils";

const AppointmentDetailModal = () => {
  const {
    activeModalAppointment,
    isDetailModalOpen,
    closeDetailModal,
    updateStatus,
    updateAppointment,
    openEditModal,
    openReceiptModal,
    deleteAppointment,
    hasPermission,
    currentRole
  } = useAppointments();

  const [notes, setNotes] = useState(activeModalAppointment?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  React.useEffect(() => {
    if (activeModalAppointment) {
      setNotes(activeModalAppointment.notes || "");
    }
  }, [activeModalAppointment]);

  if (!isDetailModalOpen || !activeModalAppointment) return null;

  const apt = activeModalAppointment;
  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    updateAppointment(apt.id, { notes });
    setTimeout(() => setIsSavingNotes(false), 500);
  };

  const cleanPhone = (apt.phone || "").replace(/\D/g, "");
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=Hello%20${encodeURIComponent(apt.clientName || "")},%20this%20is%20MediCare%20Hub%20regarding%20your%20appointment%20on%20${apt.date}%20at%20${apt.time}.`
    : null;

  const canEditNotes = hasPermission("canEditClinicalNotes");
  const canDelete = hasPermission("canDeleteAppointments");
  const canChangeStatus = hasPermission("canChangeStatus");

  return (
    <div className="modal-backdrop" onClick={closeDetailModal}>
      <div className="modal-card detail-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="ref-tag-large">{apt.referenceCode || `REF-${apt.id.slice(-4)}`}</span>
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
            {apt.priority && (
              <span className={`priority-tag tag-${apt.priority.toLowerCase()}`}>
                {apt.priority}
              </span>
            )}
          </div>
          <button className="btn-modal-close" onClick={closeDetailModal}>
            ×
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body detail-modal-body">
          {/* Patient Profile Card */}
          <div className="detail-section-card">
            <div className="section-title-row">
              <h4>👤 Patient Information</h4>
              <div className="quick-comm-links">
                {apt.email && (
                  <a href={`mailto:${apt.email}`} className="btn-comm-pill">
                    ✉️ Email
                  </a>
                )}
                {apt.phone && (
                  <a href={`tel:${apt.phone}`} className="btn-comm-pill">
                    📞 Call
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-comm-pill btn-whatsapp"
                  >
                    💬 WhatsApp
                  </a>
                )}
              </div>
            </div>

            <div className="detail-info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-val font-semibold">{apt.clientName || apt.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Contact Email</span>
                <span className="info-val">{apt.email || "Not provided"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone Number</span>
                <span className="info-val">{apt.phone || "Not provided"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Record Created</span>
                <span className="info-val">
                  {apt.createdAt ? new Date(apt.createdAt).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Service & Doctor Card */}
          <div className="detail-section-card">
            <h4>🩺 Consultation & Service Details</h4>
            <div className="detail-info-grid">
              <div className="info-item">
                <span className="info-label">Selected Service</span>
                <span className="info-val font-semibold text-primary">{apt.serviceName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Assigned Specialist</span>
                <span className="info-val font-semibold">{apt.specialistName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Date of Visit</span>
                <span className="info-val">{formatReadableDate(apt.date)}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Time & Duration</span>
                <span className="info-val">
                  {formatReadableTime(apt.time)} ({apt.duration || 30} mins)
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Location / Room</span>
                <span className="info-val">{apt.room || "Suite 101"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Consultation Fee</span>
                <span className="info-val font-bold text-success">${apt.price || 0}</span>
              </div>
            </div>
          </div>

          {/* Clinical / Case Notes */}
          <div className="detail-section-card">
            <div className="section-title-row">
              <h4>📝 Clinical Observations & Notes</h4>
              {canEditNotes ? (
                <button
                  className="btn btn-secondary btn-xs"
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                >
                  {isSavingNotes ? "Saving..." : "Save Notes"}
                </button>
              ) : (
                <span className="role-locked-pill">🔒 Physician / Admin Only</span>
              )}
            </div>
            {canEditNotes ? (
              <textarea
                className="notes-textarea"
                rows={3}
                placeholder="Record diagnosis, symptoms, or instructions here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            ) : (
              <p className="notes-read-only">
                {apt.notes ? apt.notes : "No clinical notes entered yet for this consultation."}
              </p>
            )}
          </div>

          {/* Quick Status Updater (If permitted) */}
          {canChangeStatus && (
            <div className="detail-status-strip">
              <span className="strip-label">Update Status:</span>
              <div className="status-buttons-row">
                <button
                  className={`btn-status-pill ${apt.status === "confirmed" ? "active" : ""}`}
                  onClick={() => updateStatus(apt.id, "confirmed")}
                >
                  ✓ Confirmed
                </button>
                <button
                  className={`btn-status-pill ${apt.status === "in-progress" ? "active" : ""}`}
                  onClick={() => updateStatus(apt.id, "in-progress")}
                >
                  ▶ In-Progress
                </button>
                <button
                  className={`btn-status-pill ${apt.status === "completed" ? "active" : ""}`}
                  onClick={() => updateStatus(apt.id, "completed")}
                >
                  ✅ Completed
                </button>
                <button
                  className={`btn-status-pill ${apt.status === "cancelled" ? "active" : ""}`}
                  onClick={() => updateStatus(apt.id, "cancelled")}
                >
                  ✕ Cancelled
                </button>
                <button
                  className={`btn-status-pill ${apt.status === "no-show" ? "active" : ""}`}
                  onClick={() => updateStatus(apt.id, "no-show")}
                >
                  ⚠️ No-Show
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <div className="footer-left">
            {canDelete && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteAppointment(apt.id)}
                title="Admin Delete"
              >
                🗑️ Delete
              </button>
            )}
          </div>
          <div className="footer-right">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => downloadICS(apt)}
              title="Export .ics calendar invite"
            >
              📅 Add to Calendar (.ICS)
            </button>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => openReceiptModal(apt)}
            >
              🖨️ Print Slip
            </button>
            {currentRole.id !== "patient" && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  closeDetailModal();
                  openEditModal(apt);
                }}
              >
                ✏️ Edit / Reschedule
              </button>
            )}
            <button className="btn btn-primary btn-sm" onClick={closeDetailModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
