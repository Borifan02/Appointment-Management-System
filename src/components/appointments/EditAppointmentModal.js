// src/components/appointments/EditAppointmentModal.js
import React, { useState, useEffect } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { toISODate, formatReadableTime, generateAvailableSlots } from "../../utils/calendarUtils";

const EditAppointmentModal = () => {
  const {
    activeModalAppointment,
    isEditModalOpen,
    closeEditModal,
    updateAppointment,
    specialists,
    services,
    appointments
  } = useAppointments();

  const [formData, setFormData] = useState({
    clientName: "",
    email: "",
    phone: "",
    specialistId: "",
    serviceId: "",
    date: "",
    time: "",
    status: "confirmed",
    priority: "Routine",
    notes: ""
  });

  const [conflictWarning, setConflictWarning] = useState(null);

  useEffect(() => {
    if (activeModalAppointment) {
      setFormData({
        clientName: activeModalAppointment.clientName || activeModalAppointment.name || "",
        email: activeModalAppointment.email || "",
        phone: activeModalAppointment.phone || "",
        specialistId: activeModalAppointment.specialistId || "",
        serviceId: activeModalAppointment.serviceId || "",
        date: activeModalAppointment.date || toISODate(new Date()),
        time: activeModalAppointment.time || "09:00",
        status: activeModalAppointment.status || "confirmed",
        priority: activeModalAppointment.priority || "Routine",
        notes: activeModalAppointment.notes || ""
      });
      setConflictWarning(null);
    }
  }, [activeModalAppointment]);

  if (!isEditModalOpen || !activeModalAppointment) return null;

  const currentSpecialist = specialists.find((s) => s.id === formData.specialistId);
  const currentService = services.find((s) => s.id === formData.serviceId);

  // Available slots for selected specialist & date
  const bookedSlots = appointments.filter(
    (a) =>
      a.date === formData.date &&
      a.specialistId === formData.specialistId &&
      a.id !== activeModalAppointment.id &&
      a.status !== "cancelled" &&
      a.status !== "no-show"
  );

  const duration = currentService?.duration || 30;
  const startHour = currentSpecialist?.workingHours?.start || "08:30";
  const endHour = currentSpecialist?.workingHours?.end || "17:00";
  const slots = generateAvailableSlots(startHour, endHour, duration, bookedSlots);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.clientName.trim()) {
      alert("Please enter a patient name.");
      return;
    }

    const res = updateAppointment(activeModalAppointment.id, formData);
    if (res.success) {
      closeEditModal();
    } else if (res.conflict) {
      setConflictWarning(
        `Slot conflict with ${res.conflict.clientName} (${res.conflict.time}). Please select another slot.`
      );
    }
  };

  return (
    <div className="modal-backdrop" onClick={closeEditModal}>
      <div className="modal-card edit-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <h3>✏️ Edit / Reschedule Appointment</h3>
            <span className="ref-badge">{activeModalAppointment.referenceCode}</span>
          </div>
          <button className="btn-modal-close" onClick={closeEditModal}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body edit-modal-body">
            {conflictWarning && (
              <div className="alert-conflict-box">
                ⚠️ {conflictWarning}
              </div>
            )}

            <div className="form-grid-two">
              <div className="form-group">
                <label className="input-label">Patient Name *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Status</label>
                <select
                  className="form-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Medical Service</label>
                <select
                  className="form-input"
                  value={formData.serviceId}
                  onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (${s.price} - {s.duration}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Assigned Specialist</label>
                <select
                  className="form-input"
                  value={formData.specialistId}
                  onChange={(e) => setFormData({ ...formData, specialistId: e.target.value })}
                >
                  {specialists.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Date *</label>
                <input
                  type="date"
                  required
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    setConflictWarning(null);
                  }}
                />
              </div>

              <div className="form-group">
                <label className="input-label">Time *</label>
                <select
                  className="form-input"
                  value={formData.time}
                  onChange={(e) => {
                    setFormData({ ...formData, time: e.target.value });
                    setConflictWarning(null);
                  }}
                >
                  {slots.map((slot) => (
                    <option
                      key={slot.time}
                      value={slot.time}
                      disabled={!slot.isAvailable && slot.time !== activeModalAppointment.time}
                    >
                      {formatReadableTime(slot.time)} {!slot.isAvailable && slot.time !== activeModalAppointment.time ? "(Booked)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="input-label">Priority Tag</label>
                <select
                  className="form-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="Routine">Routine</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Urgent">Urgent</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="input-label">Clinical Notes</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAppointmentModal;
