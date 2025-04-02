import React, { useState } from "react";
const AppointmentForm = ({ addAppointment }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addAppointment(name, date);
    setName("");
    setDate("");
  };
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-25">
            <label htmlFor="fname">Full Name</label>
          </div>

          <div className="col-75">
            <input
              type="text"
              id="fname"
              name="fname"
              placeholder="Your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-25">
            <label htmlFor="fname">Appointment Date:</label>
          </div>
          <div className="col-75">
            <input
              id="fname"
              name="firstname"
              placeholder="Your name..."
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <input type="submit" value="Add Appointment" />
        </div>
      </form>
    </div>
  );
};
export default AppointmentForm;
