// src/utils/calendarUtils.js

export const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: "clock",
    badgeClass: "badge-pending",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.15)",
    borderColor: "#f59e0b"
  },
  confirmed: {
    label: "Confirmed",
    icon: "check-circle",
    badgeClass: "badge-confirmed",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    borderColor: "#3b82f6"
  },
  "in-progress": {
    label: "In Progress",
    icon: "spinner",
    badgeClass: "badge-in-progress",
    color: "#8b5cf6",
    bgColor: "rgba(139, 92, 246, 0.15)",
    borderColor: "#8b5cf6"
  },
  completed: {
    label: "Completed",
    icon: "circle-check",
    badgeClass: "badge-completed",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.15)",
    borderColor: "#10b981"
  },
  cancelled: {
    label: "Cancelled",
    icon: "ban",
    badgeClass: "badge-cancelled",
    color: "#ef4444",
    bgColor: "rgba(239, 68, 68, 0.15)",
    borderColor: "#ef4444"
  },
  "no-show": {
    label: "No-Show",
    icon: "user-xmark",
    badgeClass: "badge-noshow",
    color: "#6b7280",
    bgColor: "rgba(107, 114, 128, 0.15)",
    borderColor: "#6b7280"
  }
};

/**
 * Format YYYY-MM-DD to readable date
 */
export const formatReadableDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const [year, month, day] = dateStr.split("-").map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
};

/**
 * Format 24h time "14:30" to "2:30 PM"
 */
export const formatReadableTime = (timeStr) => {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const displayM = m < 10 ? `0${m}` : m;
  return `${displayH}:${displayM} ${period}`;
};

/**
 * Get ISO Date string "YYYY-MM-DD" from a Date object
 */
export const toISODate = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Add days to a Date or ISO string
 */
export const addDaysToDate = (dateOrStr, days) => {
  const d = typeof dateOrStr === "string" ? new Date(dateOrStr + "T00:00:00") : new Date(dateOrStr);
  d.setDate(d.getDate() + days);
  return toISODate(d);
};

/**
 * Convert time string "14:30" to total minutes from midnight
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

/**
 * Convert minutes from midnight to "HH:MM"
 */
export const minutesToTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/**
 * Check if two time intervals [start1, end1] and [start2, end2] overlap
 */
export const isIntervalOverlapping = (start1, duration1, start2, duration2) => {
  const s1 = timeToMinutes(start1);
  const e1 = s1 + duration1;
  const s2 = timeToMinutes(start2);
  const e2 = s2 + duration2;
  return s1 < e2 && s2 < e1;
};

/**
 * Check if appointment has a conflict with existing appointments
 */
export const checkAppointmentConflict = (
  appointments,
  specialistId,
  date,
  time,
  durationMinutes = 30,
  excludeId = null
) => {
  if (!appointments || !specialistId || !date || !time) return null;

  const relevant = appointments.filter(
    (apt) =>
      apt.date === date &&
      apt.specialistId === specialistId &&
      apt.id !== excludeId &&
      apt.status !== "cancelled" &&
      apt.status !== "no-show"
  );

  for (const existing of relevant) {
    const existingDuration = existing.duration || 30;
    if (isIntervalOverlapping(time, durationMinutes, existing.time, existingDuration)) {
      return existing; // returns the conflicting appointment
    }
  }
  return null;
};

/**
 * Generate time slots between start and end with step interval (e.g. 30m)
 */
export const generateAvailableSlots = (
  startTime = "09:00",
  endTime = "17:00",
  duration = 30,
  bookedSlots = []
) => {
  const startMin = timeToMinutes(startTime);
  const endMin = timeToMinutes(endTime);
  const slots = [];

  for (let min = startMin; min + duration <= endMin; min += 30) {
    const slotTime = minutesToTime(min);
    const isBooked = bookedSlots.some((booked) => {
      const bMin = timeToMinutes(booked.time);
      const bDur = booked.duration || 30;
      return min < bMin + bDur && bMin < min + duration;
    });

    slots.push({
      time: slotTime,
      displayTime: formatReadableTime(slotTime),
      isAvailable: !isBooked
    });
  }

  return slots;
};

/**
 * Generate iCalendar (.ics) file string for Google Calendar, Apple Calendar, Outlook
 */
export const generateICSFile = (appointment) => {
  const { id, clientName, serviceName, specialistName, date, time, duration = 30, notes, room } = appointment;
  
  // Format start and end date-time in UTC / Local iCal format
  const [year, month, day] = date.split("").length ? date.split("-") : ["2026", "10", "28"];
  const [hours, minutes] = time.split(":").map(Number);
  
  const startD = new Date(Number(year), Number(month) - 1, Number(day), hours, minutes);
  const endD = new Date(startD.getTime() + duration * 60000);

  const formatICSDate = (d) => {
    return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  };

  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//MedicareHub//AppointmentManagementSystem//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:appointment-${id}@medicarehub.app`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startD)}`,
    `DTEND:${formatICSDate(endD)}`,
    `SUMMARY:${serviceName || "Appointment"} with ${specialistName || "Specialist"}`,
    `DESCRIPTION:Patient: ${clientName}\\nService: ${serviceName}\\nSpecialist: ${specialistName}\\nNotes: ${notes || "None"}`,
    `LOCATION:${room || "MediCare Hub Medical Center"}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return icsLines.join("\r\n");
};

/**
 * Trigger download of ICS file in browser
 */
export const downloadICS = (appointment) => {
  const icsData = generateICSFile(appointment);
  const blob = new Blob([icsData], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `appointment-${appointment.id}-${appointment.date}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
