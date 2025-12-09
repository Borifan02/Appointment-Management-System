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

import React, { useState, useEffect } from "react";
import "./App.css";
import AppointmentForm from "./components/AppointmentForm";
import AppointmentList from "./components/AppointmentList";
import Statistics from "./components/Statistics";
import Toast from "./components/Toast";

const App = () => {
  const [appointments, setAppointments] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments"));
    const storedDarkMode = JSON.parse(localStorage.getItem("darkMode"));
    if (storedAppointments) setAppointments(storedAppointments);
    if (storedDarkMode) setDarkMode(storedDarkMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    document.body.className = darkMode ? "dark-mode" : "";
  }, [darkMode]);

  const updateLocalStorage = (data) => {
    localStorage.setItem("appointments", JSON.stringify(data));
  };

  const addAppointment = (name, date, time, email, phone) => {
    const newAppointment = {
      id: Date.now(),
      name,
      date,
      time,
      email,
      phone,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    const newAppointments = [...appointments, newAppointment];
    setAppointments(newAppointments);
    updateLocalStorage(newAppointments);
    showToast("✅ Appointment added successfully!", "success");
  };

  const deleteAppointment = (id) => {
    const updatedAppointments = appointments.filter((apt) => apt.id !== id);
    setAppointments(updatedAppointments);
    updateLocalStorage(updatedAppointments);
    showToast("🗑️ Appointment deleted", "info");
  };

  const editAppointment = (id, updatedData) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === id ? { ...apt, ...updatedData } : apt
    );
    setAppointments(updatedAppointments);
    updateLocalStorage(updatedAppointments);
    showToast("✏️ Appointment updated", "success");
  };

  const updateStatus = (id, status) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === id ? { ...apt, status } : apt
    );
    setAppointments(updatedAppointments);
    updateLocalStorage(updatedAppointments);
    showToast(`✅ Status changed to ${status}`, "success");
  };

  const clearAppointments = () => {
    if (window.confirm("Are you sure you want to clear all appointments?")) {
      setAppointments([]);
      localStorage.removeItem("appointments");
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📅 Appointment Management System</h1>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️" : "🌙"}
        </button>
      </header>
      <Statistics appointments={appointments} />
      <AppointmentForm addAppointment={addAppointment} />
      <AppointmentList
        appointments={appointments}
        deleteAppointment={deleteAppointment}
        editAppointment={editAppointment}
        updateStatus={updateStatus}
        clearAppointments={clearAppointments}
      />
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default App;
