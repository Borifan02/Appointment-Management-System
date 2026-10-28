// src/utils/__tests__/calendarUtils.test.js
import {
  timeToMinutes,
  minutesToTime,
  isIntervalOverlapping,
  checkAppointmentConflict,
  generateAvailableSlots,
  generateICSFile
} from "../calendarUtils";

describe("Calendar & Scheduling Utilities", () => {
  test("timeToMinutes converts HH:MM to total minutes correctly", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("14:45")).toBe(885);
  });

  test("minutesToTime converts minutes from midnight to HH:MM format", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(885)).toBe("14:45");
  });

  test("isIntervalOverlapping correctly detects time collisions", () => {
    // 09:00 - 09:30 vs 09:15 - 09:45 -> Overlap!
    expect(isIntervalOverlapping("09:00", 30, "09:15", 30)).toBe(true);

    // 09:00 - 09:30 vs 09:30 - 10:00 -> Adjacent, NOT overlapping
    expect(isIntervalOverlapping("09:00", 30, "09:30", 30)).toBe(false);

    // 09:00 - 10:00 vs 09:15 - 09:45 -> Contained within, Overlap!
    expect(isIntervalOverlapping("09:00", 60, "09:15", 30)).toBe(true);

    // 10:00 - 10:30 vs 14:00 - 14:30 -> Far apart, No overlap
    expect(isIntervalOverlapping("10:00", 30, "14:00", 30)).toBe(false);
  });

  test("checkAppointmentConflict detects doctor double-booking", () => {
    const existingAppointments = [
      {
        id: "apt-1",
        specialistId: "spec-1",
        specialistName: "Dr. Evelyn Reed",
        clientName: "Alice Smith",
        date: "2026-11-01",
        time: "10:00",
        duration: 30,
        status: "confirmed"
      },
      {
        id: "apt-2",
        specialistId: "spec-1",
        specialistName: "Dr. Evelyn Reed",
        clientName: "Bob Jones",
        date: "2026-11-01",
        time: "11:00",
        duration: 30,
        status: "cancelled" // Cancelled appointments should NOT cause conflict!
      }
    ];

    // Conflict: Dr. Reed already booked at 10:00 on 2026-11-01
    const conflict = checkAppointmentConflict(
      existingAppointments,
      "spec-1",
      "2026-11-01",
      "10:15",
      30
    );
    expect(conflict).not.toBeNull();
    expect(conflict.id).toBe("apt-1");

    // No conflict: Different doctor at same time
    const diffDoctor = checkAppointmentConflict(
      existingAppointments,
      "spec-2",
      "2026-11-01",
      "10:00",
      30
    );
    expect(diffDoctor).toBeNull();

    // No conflict: Same time as a CANCELLED appointment
    const cancelledSlot = checkAppointmentConflict(
      existingAppointments,
      "spec-1",
      "2026-11-01",
      "11:00",
      30
    );
    expect(cancelledSlot).toBeNull();

    // No conflict: Editing the existing appointment itself (excludeId)
    const editingSelf = checkAppointmentConflict(
      existingAppointments,
      "spec-1",
      "2026-11-01",
      "10:00",
      30,
      "apt-1"
    );
    expect(editingSelf).toBeNull();
  });

  test("generateAvailableSlots produces accurate available/booked statuses", () => {
    const booked = [
      { time: "09:30", duration: 30 }
    ];

    const slots = generateAvailableSlots("09:00", "11:00", 30, booked);
    // Expected slots: 09:00, 09:30, 10:00, 10:30
    expect(slots.length).toBe(4);

    const slot0900 = slots.find((s) => s.time === "09:00");
    expect(slot0900.isAvailable).toBe(true);

    const slot0930 = slots.find((s) => s.time === "09:30");
    expect(slot0930.isAvailable).toBe(false);

    const slot1000 = slots.find((s) => s.time === "10:00");
    expect(slot1000.isAvailable).toBe(true);
  });

  test("generateICSFile produces valid RFC-5545 iCalendar content", () => {
    const apt = {
      id: "apt-999",
      clientName: "Jane Doe",
      serviceName: "Cardiology Review",
      specialistName: "Dr. Sophia Patel",
      date: "2026-11-05",
      time: "14:00",
      duration: 60,
      room: "Cardiac Suite 4A",
      notes: "Follow up ECG"
    };

    const ics = generateICSFile(apt);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("VERSION:2.0");
    expect(ics).toContain("SUMMARY:Cardiology Review with Dr. Sophia Patel");
    expect(ics).toContain("LOCATION:Cardiac Suite 4A");
    expect(ics).toContain("END:VCALENDAR");
  });
});
