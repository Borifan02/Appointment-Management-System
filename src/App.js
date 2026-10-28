// src/App.js
import React, { useState } from "react";
import "./App.css";
import { AppointmentProvider, useAppointments } from "./context/AppointmentContext";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import DashboardOverview from "./components/dashboard/DashboardOverview";
import CalendarView from "./components/calendar/CalendarView";
import AppointmentsTable from "./components/appointments/AppointmentsTable";
import ClientBookingWizard from "./components/booking/ClientBookingWizard";
import StaffAndServices from "./components/roster/StaffAndServices";
import AnalyticsView from "./components/analytics/AnalyticsView";
import PatientPortalView from "./components/patient/PatientPortalView";

// Modals & Notifications
import AppointmentDetailModal from "./components/appointments/AppointmentDetailModal";
import EditAppointmentModal from "./components/appointments/EditAppointmentModal";
import AppointmentReceipt from "./components/appointments/AppointmentReceipt";
import AuthModal from "./components/auth/AuthModal";
import ConfirmModal from "./components/common/ConfirmModal";
import ToastContainer from "./components/common/Toast";

const MainAppLayout = () => {
  const { currentView } = useAppointments();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prefill state for booking wizard (e.g., when clicking a calendar slot or specialist)
  const [bookingPrefill, setBookingPrefill] = useState({ date: null, time: null });

  const handlePrefillBooking = (date, time) => {
    setBookingPrefill({ date, time });
  };

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Navbar
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      <div className="app-container">
        {/* Navigation Sidebar */}
        <Sidebar
          isOpen={isMobileMenuOpen}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        {/* Backdrop for mobile drawer */}
        {isMobileMenuOpen && (
          <div
            className="mobile-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Dynamic Viewport */}
        <main className="main-content-area">
          {currentView === "patient-portal" && <PatientPortalView />}

          {currentView === "dashboard" && <DashboardOverview />}

          {currentView === "calendar" && (
            <CalendarView onPrefillBooking={handlePrefillBooking} />
          )}

          {currentView === "appointments" && <AppointmentsTable />}

          {currentView === "booking" && (
            <ClientBookingWizard
              prefillDate={bookingPrefill.date}
              prefillTime={bookingPrefill.time}
            />
          )}

          {currentView === "roster" && (
            <StaffAndServices
              onSelectSpecialistForBooking={(specId) => {
                // optional prefill hook
              }}
              onSelectServiceForBooking={(srvId) => {
                // optional prefill hook
              }}
            />
          )}

          {currentView === "analytics" && <AnalyticsView />}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AppointmentDetailModal />
      <EditAppointmentModal />
      <AppointmentReceipt />
      <AuthModal />
      <ConfirmModal />

      {/* Global Animated Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

const App = () => {
  return (
    <AppointmentProvider>
      <MainAppLayout />
    </AppointmentProvider>
  );
};

export default App;
