// src/components/dashboard/DashboardOverview.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import AdminDashboard from "./AdminDashboard";
import DoctorDashboard from "./DoctorDashboard";
import ReceptionistDashboard from "./ReceptionistDashboard";
import PatientPortalView from "../patient/PatientPortalView";

/**
 * Dynamic Dashboard Dispatcher
 * Automatically serves the distinct, dedicated workspace matching the authenticated user's role.
 */
const DashboardOverview = () => {
  const { currentRole } = useAppointments();

  switch (currentRole.id) {
    case "patient":
      return <PatientPortalView />;
    case "doctor":
      return <DoctorDashboard />;
    case "receptionist":
      return <ReceptionistDashboard />;
    case "admin":
    default:
      return <AdminDashboard />;
  }
};

export default DashboardOverview;
