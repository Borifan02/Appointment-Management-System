// src/components/calendar/DaySchedule.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  formatReadableDate,
  formatReadableTime,
  timeToMinutes,
  STATUS_CONFIG
} from "../../utils/calendarUtils";

const DaySchedule = ({ selectedDate, onSelectSlot, filterSpecialistId }) => {
  const { appointments, specialists, openDetailModal, setCurrentView } = useAppointments();

  // Filter appointments for this date
  const dayAppointments = appointments.filter((apt) => {
    const matchesDate = apt.date === selectedDate;
    const matchesSpecialist = filterSpecialistId === "all" || apt.specialistId === filterSpecialistId;
    return matchesDate && matchesSpecialist && apt.status !== "cancelled";
  });

  // Hours to display: 08:00 to 18:00
  const hours = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  return (
    <div className="day-schedule-view">
      <div className="day-schedule-header">
        <div className="day-header-left">
          <h3>📅 Day Timeline: {formatReadableDate(selectedDate)}</h3>
          <span className="day-count-badge">{dayAppointments.length} Bookings on this day</span>
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => {
            onSelectSlot(selectedDate, "09:00");
            setCurrentView("booking");
          }}
        >
          ➕ Book for this Date
        </button>
      </div>

      <div className="day-timeline-grid">
        {hours.map((hourStr) => {
          const hourMin = timeToMinutes(hourStr);
          // find appointments starting in this hour bracket [hour, hour + 60m)
          const slotAppointments = dayAppointments.filter((apt) => {
            const aptMin = timeToMinutes(apt.time);
            return aptMin >= hourMin && aptMin < hourMin + 60;
          });

          return (
            <div key={hourStr} className="timeline-hour-row">
              <div className="timeline-hour-label">
                <span>{formatReadableTime(hourStr)}</span>
              </div>
              <div className="timeline-hour-slot">
                {slotAppointments.length === 0 ? (
                  <div
                    className="empty-slot-area"
                    onClick={() => {
                      onSelectSlot(selectedDate, hourStr);
                      setCurrentView("booking");
                    }}
                    title={`Click to book at ${formatReadableTime(hourStr)}`}
                  >
                    <span className="slot-placeholder">+ Available slot ({formatReadableTime(hourStr)})</span>
                  </div>
                ) : (
                  <div className="slot-appointments-container">
                    {slotAppointments.map((apt) => {
                      const spec = specialists.find((s) => s.id === apt.specialistId);
                      const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                      return (
                        <div
                          key={apt.id}
                          className="day-appointment-card"
                          style={{ borderLeftColor: statusInfo.color }}
                          onClick={() => openDetailModal(apt)}
                        >
                          <div className="card-top-row">
                            <span className="apt-time-badge">
                              {formatReadableTime(apt.time)} ({apt.duration || 30}m)
                            </span>
                            <span
                              className="status-pill-small"
                              style={{
                                backgroundColor: statusInfo.bgColor,
                                color: statusInfo.color
                              }}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="card-client-title">
                            <strong>{apt.clientName || apt.name}</strong>
                          </div>
                          <div className="card-meta-row">
                            <span>🩺 {apt.serviceName}</span>
                            <span>👨‍⚕️ {apt.specialistName || (spec ? spec.name : "Assigned Doctor")}</span>
                            <span>📍 {apt.room || (spec ? spec.room : "Room 101")}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DaySchedule;
