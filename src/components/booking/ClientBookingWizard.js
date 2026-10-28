// src/components/booking/ClientBookingWizard.js
import React, { useState, useEffect } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  toISODate,
  generateAvailableSlots,
  formatReadableDate,
  formatReadableTime,
  downloadICS
} from "../../utils/calendarUtils";

const ClientBookingWizard = ({ prefillDate, prefillTime }) => {
  const {
    services,
    specialists,
    appointments,
    addAppointment,
    setCurrentView,
    openReceiptModal
  } = useAppointments();

  const [currentStep, setCurrentStep] = useState(1); // 1 to 5

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [selectedSpecialistId, setSelectedSpecialistId] = useState("");
  const [bookingDate, setBookingDate] = useState(prefillDate || toISODate(new Date()));
  const [bookingTime, setBookingTime] = useState(prefillTime || "");

  // Client Details
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [priority, setPriority] = useState("Routine");
  const [notes, setNotes] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Result state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Sync prefill
  useEffect(() => {
    if (prefillDate) setBookingDate(prefillDate);
    if (prefillTime) setBookingTime(prefillTime);
  }, [prefillDate, prefillTime]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const selectedSpecialist = specialists.find((s) => s.id === selectedSpecialistId);

  // Specialists eligible for selected service
  const availableSpecialists = selectedServiceId
    ? specialists.filter((spec) => !spec.serviceIds || spec.serviceIds.includes(selectedServiceId))
    : specialists;

  // Auto-select first doctor if none selected or if previously selected doctor doesn't offer the new service
  useEffect(() => {
    if (selectedServiceId && availableSpecialists.length > 0) {
      const stillValid = availableSpecialists.some((s) => s.id === selectedSpecialistId);
      if (!stillValid) {
        setSelectedSpecialistId(availableSpecialists[0].id);
      }
    }
  }, [selectedServiceId, availableSpecialists, selectedSpecialistId]);

  // Compute available time slots for the chosen specialist on chosen date
  const bookedSlotsOnDate = appointments.filter(
    (a) =>
      a.date === bookingDate &&
      a.specialistId === selectedSpecialistId &&
      a.status !== "cancelled" &&
      a.status !== "no-show"
  );

  const duration = selectedService ? selectedService.duration : 30;
  const startHour = selectedSpecialist?.workingHours?.start || "08:30";
  const endHour = selectedSpecialist?.workingHours?.end || "17:00";

  const timeSlots = generateAvailableSlots(startHour, endHour, duration, bookedSlotsOnDate);

  // Validation
  const validateClientDetails = () => {
    const errs = {};
    if (!clientName.trim()) errs.clientName = "Patient / Client name is required";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Please enter a valid email address";
    if (!phone.trim()) {
      errs.phone = "Contact phone number is required";
    } else if (phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Please enter a valid phone number";
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedServiceId) {
        alert("Please select a medical service to proceed.");
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!selectedSpecialistId) {
        alert("Please select a doctor / specialist.");
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (!bookingDate) {
        alert("Please select a booking date.");
        return;
      }
      if (!bookingTime) {
        alert("Please select an available time slot.");
        return;
      }
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!validateClientDetails()) return;

      // Submit booking
      const result = addAppointment({
        clientName,
        email,
        phone,
        serviceId: selectedServiceId,
        specialistId: selectedSpecialistId,
        date: bookingDate,
        time: bookingTime,
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 65,
        priority,
        notes,
        status: "confirmed"
      });

      if (result.success) {
        setConfirmedBooking(result.appointment);
        setCurrentStep(5);
      }
    }
  };

  const handleResetWizard = () => {
    setSelectedServiceId("");
    setSelectedSpecialistId("");
    setBookingDate(toISODate(new Date()));
    setBookingTime("");
    setClientName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setConfirmedBooking(null);
    setCurrentStep(1);
  };

  return (
    <div className="booking-wizard-wrapper">
      {/* Wizard Progress Stepper */}
      <div className="wizard-stepper">
        <div className={`step-item ${currentStep >= 1 ? "active" : ""} ${currentStep > 1 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 1 ? "✓" : "1"}</div>
          <span className="step-label">Service</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${currentStep >= 2 ? "active" : ""} ${currentStep > 2 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 2 ? "✓" : "2"}</div>
          <span className="step-label">Specialist</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${currentStep >= 3 ? "active" : ""} ${currentStep > 3 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 3 ? "✓" : "3"}</div>
          <span className="step-label">Date & Time</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${currentStep >= 4 ? "active" : ""} ${currentStep > 4 ? "completed" : ""}`}>
          <div className="step-number">{currentStep > 4 ? "✓" : "4"}</div>
          <span className="step-label">Patient Details</span>
        </div>
        <div className="step-line" />
        <div className={`step-item ${currentStep === 5 ? "active" : ""}`}>
          <div className="step-number">5</div>
          <span className="step-label">Confirmation</span>
        </div>
      </div>

      <div className="wizard-card">
        {/* Step 1: Select Service */}
        {currentStep === 1 && (
          <div className="step-content">
            <div className="step-heading">
              <h2>Select a Consultation or Service</h2>
              <p>Choose the clinical service needed for this visit</p>
            </div>

            <div className="services-grid">
              {services.map((srv) => {
                const isSelected = selectedServiceId === srv.id;
                return (
                  <div
                    key={srv.id}
                    className={`service-card-select ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedServiceId(srv.id)}
                  >
                    <div className="service-card-top">
                      <span className="service-cat-badge">{srv.category}</span>
                      <span className="service-price-tag">${srv.price}</span>
                    </div>
                    <h3 className="service-name">{srv.name}</h3>
                    <p className="service-desc">{srv.description}</p>
                    <div className="service-card-footer">
                      <span className="service-duration">⏱️ {srv.duration} minutes</span>
                      <span className="select-indicator">{isSelected ? "Selected ✓" : "Select"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Select Specialist */}
        {currentStep === 2 && (
          <div className="step-content">
            <div className="step-heading">
              <h2>Choose Your Specialist / Physician</h2>
              <p>Specialists available for {selectedService?.name}</p>
            </div>

            <div className="specialists-grid">
              {availableSpecialists.map((spec) => {
                const isSelected = selectedSpecialistId === spec.id;
                return (
                  <div
                    key={spec.id}
                    className={`specialist-card-select ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedSpecialistId(spec.id)}
                  >
                    <div className="specialist-avatar-wrap">
                      <img src={spec.avatar} alt={spec.name} className="specialist-photo" />
                      <span className="specialist-rating-tag">★ {spec.rating}</span>
                    </div>
                    <div className="specialist-body">
                      <h3>{spec.name}</h3>
                      <p className="specialist-title">{spec.role}</p>
                      <p className="specialist-specialty">{spec.specialty}</p>
                      <div className="specialist-meta-pills">
                        <span>Experience: {spec.experienceYears}y</span>
                        <span>{spec.room}</span>
                      </div>
                      <div className="specialist-hours-note">
                        Hours: {spec.workingHours?.start} - {spec.workingHours?.end}
                      </div>
                    </div>
                    <div className="specialist-select-footer">
                      <span className="select-indicator">{isSelected ? "Selected ✓" : "Select Doctor"}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Date & Available Time Slot */}
        {currentStep === 3 && (
          <div className="step-content">
            <div className="step-heading">
              <h2>Pick Date & Available Time Slot</h2>
              <p>
                Booking with <strong>{selectedSpecialist?.name}</strong> ({selectedService?.name})
              </p>
            </div>

            <div className="date-time-picker-layout">
              <div className="date-picker-side">
                <label className="input-label">Select Appointment Date</label>
                <input
                  type="date"
                  className="form-input date-input-large"
                  min={toISODate(new Date())}
                  value={bookingDate}
                  onChange={(e) => {
                    setBookingDate(e.target.value);
                    setBookingTime(""); // reset chosen time on date change
                  }}
                />
                <div className="date-info-box">
                  <p><strong>Selected Date:</strong> {formatReadableDate(bookingDate)}</p>
                  <p><strong>Session Duration:</strong> {duration} minutes</p>
                  <p><strong>Room:</strong> {selectedSpecialist?.room}</p>
                </div>
              </div>

              <div className="time-slots-side">
                <label className="input-label">
                  Available Slots for {formatReadableDate(bookingDate)}
                </label>
                <div className="slots-grid">
                  {timeSlots.map((slot) => {
                    const isSelected = bookingTime === slot.time;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        disabled={!slot.isAvailable}
                        className={`slot-btn ${isSelected ? "selected" : ""} ${
                          !slot.isAvailable ? "booked" : "available"
                        }`}
                        onClick={() => setBookingTime(slot.time)}
                      >
                        <span className="slot-time-text">{slot.displayTime}</span>
                        <span className="slot-status-text">
                          {slot.isAvailable ? "Available" : "Booked"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {bookingTime && (
                  <div className="selected-slot-banner">
                    ✅ Selected Time: <strong>{formatReadableTime(bookingTime)}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Patient Details */}
        {currentStep === 4 && (
          <div className="step-content">
            <div className="step-heading">
              <h2>Patient Information & Visit Reason</h2>
              <p>Please enter contact info to finalize the appointment registration</p>
            </div>

            <div className="booking-summary-strip">
              <div className="summary-col">
                <span className="summary-label">SERVICE</span>
                <span className="summary-val">{selectedService?.name} (${selectedService?.price})</span>
              </div>
              <div className="summary-col">
                <span className="summary-label">SPECIALIST</span>
                <span className="summary-val">{selectedSpecialist?.name}</span>
              </div>
              <div className="summary-col">
                <span className="summary-label">SCHEDULE</span>
                <span className="summary-val">
                  {formatReadableDate(bookingDate)} at {formatReadableTime(bookingTime)}
                </span>
              </div>
            </div>

            <div className="patient-form-grid">
              <div className="form-group full-width">
                <label className="input-label">Patient / Client Full Name *</label>
                <input
                  type="text"
                  className={`form-input ${formErrors.clientName ? "input-error" : ""}`}
                  placeholder="e.g. Johnathan Miller"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
                {formErrors.clientName && <span className="error-text">{formErrors.clientName}</span>}
              </div>

              <div className="form-group">
                <label className="input-label">Email Address (for confirmation & ICS)</label>
                <input
                  type="email"
                  className={`form-input ${formErrors.email ? "input-error" : ""}`}
                  placeholder="patient@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {formErrors.email && <span className="error-text">{formErrors.email}</span>}
              </div>

              <div className="form-group">
                <label className="input-label">Phone Number *</label>
                <input
                  type="tel"
                  className={`form-input ${formErrors.phone ? "input-error" : ""}`}
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
              </div>

              <div className="form-group">
                <label className="input-label">Visit Priority / Category</label>
                <select
                  className="form-input"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="Routine">Routine Visit</option>
                  <option value="Follow-up">Follow-up Consultation</option>
                  <option value="Urgent">Urgent / Priority</option>
                  <option value="VIP">VIP Client</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label className="input-label">Reason for Visit / Clinical Notes (Optional)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe any symptoms, previous medical history, or special accommodations needed..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Success Confirmation Screen */}
        {currentStep === 5 && confirmedBooking && (
          <div className="step-content confirmation-screen">
            <div className="confirmation-header">
              <div className="confirmation-badge-icon">✓</div>
              <h2>Appointment Successfully Booked!</h2>
              <p className="reference-code-display">
                Reference Code: <strong>{confirmedBooking.referenceCode}</strong>
              </p>
            </div>

            <div className="receipt-card-preview">
              <div className="receipt-row">
                <span className="receipt-label">Patient Name:</span>
                <span className="receipt-value">{confirmedBooking.clientName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Specialist:</span>
                <span className="receipt-value">{confirmedBooking.specialistName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Service:</span>
                <span className="receipt-value">{confirmedBooking.serviceName}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Date & Time:</span>
                <span className="receipt-value">
                  {formatReadableDate(confirmedBooking.date)} at {formatReadableTime(confirmedBooking.time)}
                </span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Location:</span>
                <span className="receipt-value">{confirmedBooking.room}</span>
              </div>
              <div className="receipt-row">
                <span className="receipt-label">Total Fee:</span>
                <span className="receipt-value font-bold">${confirmedBooking.price}</span>
              </div>
            </div>

            <div className="confirmation-actions">
              <button
                className="btn btn-primary"
                onClick={() => downloadICS(confirmedBooking)}
                title="Download .ics file to add to Google Calendar, Apple Calendar, or Outlook"
              >
                <span>📅</span> Add to Google / Apple Calendar (.ICS)
              </button>

              <button
                className="btn btn-outline"
                onClick={() => openReceiptModal(confirmedBooking)}
              >
                <span>🖨️</span> Print Patient Slip / Receipt
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setCurrentView("calendar")}
              >
                <span>🗓️</span> View in Calendar
              </button>

              <button
                className="btn btn-secondary"
                onClick={handleResetWizard}
              >
                <span>➕</span> Book Another
              </button>
            </div>
          </div>
        )}

        {/* Wizard Footer Navigation Controls */}
        {currentStep < 5 && (
          <div className="wizard-footer">
            {currentStep > 1 ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                ← Back
              </button>
            ) : <div />}

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextStep}
            >
              {currentStep === 4 ? "Confirm & Book Appointment →" : "Continue →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientBookingWizard;
