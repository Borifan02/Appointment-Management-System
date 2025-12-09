import React, { useState } from "react";

const AppointmentForm = ({ addAppointment }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!date) newErrors.date = "Date is required";
    if (!time) newErrors.time = "Time is required";
    if (date && new Date(date) < new Date().setHours(0, 0, 0, 0))
      newErrors.date = "Cannot book past dates";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email";
    if (phone && !/^\d{10}$/.test(phone.replace(/\D/g, "")))
      newErrors.phone = "Invalid phone (10 digits)";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addAppointment(name, date, time, email, phone);
    setName("");
    setDate("");
    setTime("");
    setEmail("");
    setPhone("");
    setErrors({});
  };

  return (
    <div className="container form-container">
      <h2>📝 Book New Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-msg">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-msg">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              placeholder="1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={errors.date ? "error" : ""}
            />
            {errors.date && <span className="error-msg">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label>Time *</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={errors.time ? "error" : ""}
            />
            {errors.time && <span className="error-msg">{errors.time}</span>}
          </div>
        </div>
        <button type="submit" className="btn-primary">➕ Add Appointment</button>
      </form>
    </div>
  );
};

export default AppointmentForm;
