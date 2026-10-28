// src/components/calendar/CalendarView.js
import React, { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import DaySchedule from "./DaySchedule";
import {
  toISODate,
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG
} from "../../utils/calendarUtils";

const CalendarView = ({ onPrefillBooking }) => {
  const {
    appointments,
    specialists,
    selectedDate,
    setSelectedDate,
    openDetailModal,
    setCurrentView
  } = useAppointments();

  const [calendarMode, setCalendarMode] = useState("month"); // 'month' | 'day'
  const [filterSpecialistId, setFilterSpecialistId] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Current viewed month and year
  const initialDate = selectedDate ? new Date(selectedDate + "T00:00:00") : new Date();
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth()); // 0-indexed

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(toISODate(now));
  };

  // Build calendar matrix
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayWeekday = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

  // Days from previous month
  const prevMonthDaysCount = new Date(currentYear, currentMonth, 0).getDate();
  const leadingDays = [];
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    leadingDays.push({
      day: prevMonthDaysCount - i,
      isCurrentMonth: false,
      dateStr: toISODate(new Date(currentYear, currentMonth - 1, prevMonthDaysCount - i))
    });
  }

  // Days in current month
  const currentMonthDays = [];
  for (let day = 1; day <= daysInMonth; day++) {
    currentMonthDays.push({
      day,
      isCurrentMonth: true,
      dateStr: toISODate(new Date(currentYear, currentMonth, day))
    });
  }

  // Trailing days from next month to fill grid to multiple of 7
  const totalCells = leadingDays.length + currentMonthDays.length;
  const trailingCount = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  const trailingDays = [];
  for (let day = 1; day <= trailingCount; day++) {
    trailingDays.push({
      day,
      isCurrentMonth: false,
      dateStr: toISODate(new Date(currentYear, currentMonth + 1, day))
    });
  }

  const allCalendarDays = [...leadingDays, ...currentMonthDays, ...trailingDays];

  // Month name display
  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric"
  });

  const todayStr = toISODate(new Date());

  // Filtered appointments map by date
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSpec = filterSpecialistId === "all" || apt.specialistId === filterSpecialistId;
    const matchesStat = filterStatus === "all" || apt.status === filterStatus;
    return matchesSpec && matchesStat;
  });

  const appointmentsByDate = filteredAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {});

  // Selected date appointments
  const selectedDateAppointments = appointmentsByDate[selectedDate] || [];

  return (
    <div className="calendar-view-container">
      {/* Calendar Header Controls */}
      <div className="calendar-controls-bar">
        <div className="controls-left">
          <div className="month-navigation">
            <button className="btn-nav" onClick={handlePrevMonth} title="Previous Month">
              ‹
            </button>
            <h2 className="current-month-label">{monthName}</h2>
            <button className="btn-nav" onClick={handleNextMonth} title="Next Month">
              ›
            </button>
            <button className="btn btn-outline btn-sm ml-2" onClick={handleGoToday}>
              Today
            </button>
          </div>
        </div>

        <div className="controls-right">
          {/* Mode Switcher */}
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${calendarMode === "month" ? "active" : ""}`}
              onClick={() => setCalendarMode("month")}
            >
              📅 Month Grid
            </button>
            <button
              className={`toggle-btn ${calendarMode === "day" ? "active" : ""}`}
              onClick={() => setCalendarMode("day")}
            >
              🕒 Day Timeline
            </button>
          </div>

          {/* Specialist Filter */}
          <select
            className="calendar-select"
            value={filterSpecialistId}
            onChange={(e) => setFilterSpecialistId(e.target.value)}
          >
            <option value="all">All Specialists</option>
            {specialists.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="calendar-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {calendarMode === "day" ? (
        <DaySchedule
          selectedDate={selectedDate}
          filterSpecialistId={filterSpecialistId}
          onSelectSlot={(date, time) => {
            if (onPrefillBooking) onPrefillBooking(date, time);
          }}
        />
      ) : (
        <>
          {/* Monthly Calendar Grid */}
          <div className="calendar-grid-card">
            {/* Weekday headers */}
            <div className="calendar-weekdays-row">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="weekday-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Date Cells */}
            <div className="calendar-days-grid">
              {allCalendarDays.map((cell, index) => {
                const dayApts = appointmentsByDate[cell.dateStr] || [];
                const isSelected = cell.dateStr === selectedDate;
                const isToday = cell.dateStr === todayStr;

                return (
                  <div
                    key={index}
                    className={`calendar-cell ${!cell.isCurrentMonth ? "cell-adjacent" : ""} ${
                      isSelected ? "cell-selected" : ""
                    } ${isToday ? "cell-today" : ""}`}
                    onClick={() => setSelectedDate(cell.dateStr)}
                  >
                    <div className="cell-top">
                      <span className="cell-day-num">{cell.day}</span>
                      {dayApts.length > 0 && (
                        <span className="cell-count-badge">{dayApts.length}</span>
                      )}
                    </div>

                    <div className="cell-appointments">
                      {dayApts.slice(0, 3).map((apt) => {
                        const statusConfig = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                        return (
                          <div
                            key={apt.id}
                            className="cell-appointment-pill"
                            style={{
                              borderLeftColor: statusConfig.color,
                              backgroundColor: statusConfig.bgColor
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailModal(apt);
                            }}
                            title={`${formatReadableTime(apt.time)} - ${apt.clientName} (${apt.serviceName})`}
                          >
                            <span className="pill-dot" style={{ backgroundColor: statusConfig.color }} />
                            <span className="pill-time">{apt.time}</span>
                            <span className="pill-name">{apt.clientName || apt.name}</span>
                          </div>
                        );
                      })}
                      {dayApts.length > 3 && (
                        <div className="cell-more-pill">+{dayApts.length - 3} more</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Inspector Panel */}
          <div className="selected-date-inspector">
            <div className="inspector-header">
              <div className="inspector-title">
                <h3>
                  📋 Schedule for {formatReadableDate(selectedDate)}{" "}
                  {selectedDate === todayStr && <span className="today-badge-chip">TODAY</span>}
                </h3>
                <span className="inspector-count">
                  {selectedDateAppointments.length} appointment
                  {selectedDateAppointments.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="inspector-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    if (onPrefillBooking) onPrefillBooking(selectedDate, "09:00");
                    setCurrentView("booking");
                  }}
                >
                  ➕ Book on {selectedDate}
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCalendarMode("day")}
                >
                  Open Day Timeline →
                </button>
              </div>
            </div>

            {selectedDateAppointments.length === 0 ? (
              <div className="inspector-empty">
                <p>No appointments scheduled for this date.</p>
              </div>
            ) : (
              <div className="inspector-cards-grid">
                {selectedDateAppointments.map((apt) => {
                  const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                  return (
                    <div
                      key={apt.id}
                      className="inspector-apt-card"
                      onClick={() => openDetailModal(apt)}
                    >
                      <div className="apt-card-header">
                        <span className="apt-time">{formatReadableTime(apt.time)}</span>
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
                      <h4 className="apt-client-name">{apt.clientName || apt.name}</h4>
                      <p className="apt-service-name">🩺 {apt.serviceName}</p>
                      <p className="apt-doctor-name">👨‍⚕️ {apt.specialistName}</p>
                      <div className="apt-card-footer">
                        <span>Duration: {apt.duration || 30}m</span>
                        <button className="btn-link" onClick={() => openDetailModal(apt)}>
                          View Details →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarView;
