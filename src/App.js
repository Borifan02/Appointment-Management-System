// App.js
/*
import React, { useState } from "react";
import "./App.css";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const addAppointment = (appointment) => {
    setAppointments([...appointments, appointment]);
  };
  const deleteAppointment = (index) => {
    const deletetedAppointments = [...appointments];
    deletetedAppointments.splice(index, 1);
    setAppointments(deletetedAppointments);
  };
  const editAppointment = (index, editedName, editedDate) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index] = {
      name: editedName,
      date: editedDate,
    };
    setAppointments(updatedAppointments);
  };
  const clearAppointments = () => {
    setAppointments([]);
  };
  return (
    <div>
      <h1>Appointments Management System</h1>
      <AppointmentForm addAppointment={addAppointment} />
      <AppointmentList
        appointments={appointments}
        deleteAppointment={deleteAppointment}
        clearAppointments={clearAppointments}
        editAppointment={editAppointment}
      />
    </div>
  );
};
export default App;*/

// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";

const App = () => {
  const [appointments, setAppointments] = useState([]);

  // Load appointments from localStorage on mount
  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
    if (storedAppointments) setAppointments(storedAppointments);
  }, []);

  // Function to update localStorage
  const updateLocalStorage = (data) => {
    localStorage.setItem("appointments", JSON.stringify(data));
  };

  const addAppointment = (name, date) => {
    if (!name || !date) return alert("Please enter both name and date!");
    const newAppointments = [...appointments, { name, date }];
    setAppointments(newAppointments);
    updateLocalStorage(newAppointments);
  };

  const deleteAppointment = (index) => {
    const updatedAppointments = appointments.filter((_, i) => i !== index);
    setAppointments(updatedAppointments);
    updateLocalStorage(updatedAppointments);
  };

  const editAppointment = (index, editedName, editedDate) => {
    if (!editedName || !editedDate) return alert("Both fields are required!");
    const updatedAppointments = [...appointments];
    updatedAppointments[index] = { name: editedName, date: editedDate };
    setAppointments(updatedAppointments);
    updateLocalStorage(updatedAppointments);
  };

  const clearAppointments = () => {
    setAppointments([]);
    localStorage.removeItem("appointments");
  };

  return (
    <div>
      <h1>Appointments Management System</h1>
      <AppointmentForm addAppointment={addAppointment} />
      <AppointmentList
        appointments={appointments}
        deleteAppointment={deleteAppointment}
        editAppointment={editAppointment}
        clearAppointments={clearAppointments}
      />
    </div>
  );
};

export default App;
