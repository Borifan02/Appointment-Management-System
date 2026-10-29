// src/context/AppointmentContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_SERVICES } from "../data/services";
import { INITIAL_SPECIALISTS } from "../data/specialists";
import { getRealisticDemoAppointments } from "../data/demoData";
import { SYSTEM_ROLES } from "../data/roles";
import { checkAppointmentConflict, toISODate } from "../utils/calendarUtils";

const AppointmentContext = createContext(null);

const STORAGE_KEYS = {
  APPOINTMENTS: "medicare_appointments_v2",
  SERVICES: "medicare_services_v2",
  SPECIALISTS: "medicare_specialists_v2",
  DARK_MODE: "medicare_dark_mode_v2",
  ACTIVE_ROLE: "medicare_active_role_v2"
};

export const AppointmentProvider = ({ children }) => {
  // Load initial appointments or populate with realistic demo appointments
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load appointments from localStorage", e);
    }
    return getRealisticDemoAppointments();
  });

  const [services, setServices] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SERVICES;
  });

  const [specialists, setSpecialists] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SPECIALISTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_SPECIALISTS;
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      return false;
    }
  });

  // Active User Role: 'admin' | 'doctor' | 'receptionist' | 'patient'
  const [currentRole, setCurrentRole] = useState(() => {
    try {
      const savedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      if (savedRole && SYSTEM_ROLES[savedRole]) {
        return SYSTEM_ROLES[savedRole];
      }
    } catch (e) {}
    return SYSTEM_ROLES.admin;
  });

  // Navigation State
  const [currentView, setCurrentView] = useState(() => currentRole.defaultView || "dashboard");
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));

  // Active modals
  const [activeModalAppointment, setActiveModalAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Authentication State & Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState("login");
  const [currentUser, setCurrentUser] = useState(() => currentRole);

  // Admin Staff Provisioning Modal
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  // Confirmation Modal
  const [confirmConfig, setConfirmConfig] = useState(null);

  // Toast notification queue
  const [toasts, setToasts] = useState([]);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {}
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
    } catch (e) {}
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SPECIALISTS, JSON.stringify(specialists));
    } catch (e) {}
  }, [specialists]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, currentRole.id);
    } catch (e) {}
  }, [currentRole]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
    } catch (e) {}
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark-mode");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Toast Helper
  const showToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, timestamp: new Date() };
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Role Switcher
  const switchRole = useCallback((roleId) => {
    const targetRole = SYSTEM_ROLES[roleId];
    if (!targetRole) return;

    setCurrentRole(targetRole);

    // If current view is not allowed for the new role, automatically navigate to default view
    if (!targetRole.allowedViews.includes(currentView)) {
      setCurrentView(targetRole.defaultView);
    }

    showToast(`Switched active role: ${targetRole.roleLabel}`, "info", 3500);
  }, [currentView, showToast]);

  const hasPermission = useCallback((permissionKey) => {
    return Boolean(currentRole?.permissions?.[permissionKey]);
  }, [currentRole]);

  const canAccessView = useCallback((viewId) => {
    return currentRole?.allowedViews?.includes(viewId);
  }, [currentRole]);

  // Modal helpers
  const openDetailModal = useCallback((appointment) => {
    setActiveModalAppointment(appointment);
    setIsDetailModalOpen(true);
  }, []);

  const closeDetailModal = useCallback(() => {
    setIsDetailModalOpen(false);
    setActiveModalAppointment(null);
  }, []);

  const openEditModal = useCallback((appointment) => {
    setActiveModalAppointment(appointment);
    setIsEditModalOpen(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setActiveModalAppointment(null);
  }, []);

  const openReceiptModal = useCallback((appointment) => {
    setActiveModalAppointment(appointment);
    setIsReceiptModalOpen(true);
  }, []);

  const closeReceiptModal = useCallback(() => {
    setIsReceiptModalOpen(false);
  }, []);

  // Authentication Helpers & Methods
  const openAuthModal = useCallback((tab = "login") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = useCallback(
    (email, password) => {
      const trimmedEmail = (email || "").trim().toLowerCase();

      // Check system roles demo users
      const matchedRole = Object.values(SYSTEM_ROLES).find(
        (r) => r.email.toLowerCase() === trimmedEmail
      );

      if (matchedRole) {
        setCurrentRole(matchedRole);
        setCurrentUser(matchedRole);
        if (!matchedRole.allowedViews.includes(currentView)) {
          setCurrentView(matchedRole.defaultView);
        }
        showToast(`Signed in as ${matchedRole.name} (${matchedRole.roleLabel})`, "success", 4000);
        return { success: true, user: matchedRole };
      }

      // Check custom registered users in localStorage
      try {
        const savedUsers = JSON.parse(localStorage.getItem("medicare_registered_users") || "[]");
        const found = savedUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
        if (found) {
          const baseRole = SYSTEM_ROLES[found.role] || SYSTEM_ROLES.patient;
          const customRole = {
            ...baseRole,
            name: found.name,
            email: found.email,
            phone: found.phone,
            clientEmail: found.email
          };
          setCurrentRole(customRole);
          setCurrentUser(customRole);
          if (!customRole.allowedViews.includes(currentView)) {
            setCurrentView(customRole.defaultView);
          }
          showToast(`Welcome back, ${customRole.name}!`, "success", 4000);
          return { success: true, user: customRole };
        }
      } catch (e) {}

      return {
        success: false,
        message: "No matching account found with that email. Try a demo account or click 'Create New Account'."
      };
    },
    [currentView, showToast]
  );

  const signup = useCallback(
    (userData) => {
      const { name, email, phone, role = "patient" } = userData;
      const trimmedEmail = (email || "").trim().toLowerCase();

      const newUser = {
        id: `usr-${Date.now()}`,
        name,
        email: trimmedEmail,
        phone,
        role,
        createdAt: new Date().toISOString()
      };

      try {
        const savedUsers = JSON.parse(localStorage.getItem("medicare_registered_users") || "[]");
        const filtered = savedUsers.filter((u) => u.email.toLowerCase() !== trimmedEmail);
        localStorage.setItem("medicare_registered_users", JSON.stringify([newUser, ...filtered]));
      } catch (e) {}

      const baseRole = SYSTEM_ROLES[role] || SYSTEM_ROLES.patient;
      const customRole = {
        ...baseRole,
        name,
        email: trimmedEmail,
        phone,
        clientEmail: trimmedEmail
      };

      setCurrentRole(customRole);
      setCurrentUser(customRole);
      setCurrentView(customRole.defaultView || "dashboard");
      showToast(`🎉 Welcome to MediCare Hub, ${name}! Your account is active.`, "success", 5000);
      return { success: true, user: customRole };
    },
    [showToast]
  );

  const logout = useCallback(() => {
    setCurrentRole(SYSTEM_ROLES.patient);
    setCurrentUser(null);
    setCurrentView("patient-portal");
    showToast("You have been signed out.", "info");
    setIsAuthModalOpen(true);
  }, [showToast]);

  // Admin Staff Provisioning Helpers
  const openAddStaffModal = useCallback(() => {
    setIsAddStaffModalOpen(true);
  }, []);

  const closeAddStaffModal = useCallback(() => {
    setIsAddStaffModalOpen(false);
  }, []);

  const addStaffMember = useCallback(
    (staffData) => {
      if (!hasPermission("canManageRoster")) {
        showToast("⛔ Permission Denied: Only Clinic Administrators can provision staff accounts.", "error", 4000);
        return { success: false, message: "Unauthorized" };
      }

      const {
        name,
        email,
        phone,
        role = "doctor",
        password,
        specialty = "General Medicine",
        room = "Suite 101",
        workingHours = { start: "09:00", end: "17:00" },
        availableDays = ["Mon", "Tue", "Wed", "Thu", "Fri"]
      } = staffData;

      const trimmedEmail = (email || "").trim().toLowerCase();

      // Check if email already registered in custom users or demo roles
      const savedUsers = JSON.parse(localStorage.getItem("medicare_registered_users") || "[]");
      const isRoleEmail = Object.values(SYSTEM_ROLES).some((r) => r.email.toLowerCase() === trimmedEmail);
      if (isRoleEmail || savedUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        showToast("⚠️ An account with this email address already exists.", "error", 4000);
        return { success: false, message: "Email already exists" };
      }

      let newSpecialistId = null;

      if (role === "doctor") {
        newSpecialistId = `spec-${Date.now()}`;
        const newSpecialist = {
          id: newSpecialistId,
          name,
          specialty,
          role: "Consultant Physician",
          room,
          phone,
          email: trimmedEmail,
          avatar:
            staffData.avatar ||
            "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=120&auto=format&fit=crop&q=80",
          workingHours,
          availableDays,
          rating: 5.0,
          experience: "Senior Specialist",
          bio: `${name} is an active practitioner specializing in ${specialty} at MediCare Hub.`
        };

        setSpecialists((prev) => [...prev, newSpecialist]);
      }

      // Create credentials in user storage
      const newStaffUser = {
        id: `usr-${Date.now()}`,
        name,
        email: trimmedEmail,
        phone,
        role,
        specialistId: newSpecialistId,
        password: password || "StaffWelcome2026!",
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("medicare_registered_users", JSON.stringify([...savedUsers, newStaffUser]));

      showToast(
        `🎉 Successfully provisioned ${role === "doctor" ? "Doctor" : "Front Desk Staff"}: ${name}!`,
        "success",
        6000
      );

      return { success: true, user: newStaffUser, specialistId: newSpecialistId };
    },
    [hasPermission, showToast]
  );

  // Confirmation dialog
  const requestConfirm = useCallback(({ title, message, onConfirm, confirmText = "Confirm", isDanger = false }) => {
    setConfirmConfig({
      title,
      message,
      confirmText,
      isDanger,
      onConfirm: () => {
        onConfirm();
        setConfirmConfig(null);
      },
      onCancel: () => setConfirmConfig(null)
    });
  }, []);

  // CRUD Actions
  const addAppointment = useCallback((appointmentData) => {
    const { specialistId, date, time, duration = 30 } = appointmentData;

    // Check for double booking conflict
    const conflict = checkAppointmentConflict(appointments, specialistId, date, time, duration);
    if (conflict) {
      showToast(
        `⚠️ Time slot conflict: ${conflict.specialistName} already has an appointment with ${conflict.clientName} at ${conflict.time}.`,
        "error",
        5000
      );
      return { success: false, conflict };
    }

    const specialist = specialists.find((s) => s.id === specialistId);
    const service = services.find((srv) => srv.id === appointmentData.serviceId);

    const newAppointment = {
      id: `apt-${Date.now()}`,
      referenceCode: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      clientName: appointmentData.clientName || appointmentData.name,
      email: appointmentData.email || "",
      phone: appointmentData.phone || "",
      specialistId,
      specialistName: specialist ? specialist.name : (appointmentData.specialistName || "Assigned Specialist"),
      serviceId: appointmentData.serviceId,
      serviceName: service ? service.name : (appointmentData.serviceName || "Consultation"),
      date,
      time,
      duration: duration || (service ? service.duration : 30),
      price: service ? service.price : (appointmentData.price || 50),
      status: appointmentData.status || "confirmed",
      priority: appointmentData.priority || "Routine",
      room: specialist ? specialist.room : "Suite 101",
      notes: appointmentData.notes || "",
      createdAt: new Date().toISOString()
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`✅ Appointment confirmed for ${newAppointment.clientName}! Reference: ${newAppointment.referenceCode}`, "success");
    return { success: true, appointment: newAppointment };
  }, [appointments, specialists, services, showToast]);

  const updateAppointment = useCallback((id, updatedData) => {
    const existing = appointments.find((a) => a.id === id);
    if (!existing) return { success: false, message: "Appointment not found" };

    const targetSpecialistId = updatedData.specialistId || existing.specialistId;
    const targetDate = updatedData.date || existing.date;
    const targetTime = updatedData.time || existing.time;
    const targetDuration = updatedData.duration || existing.duration || 30;

    // Conflict check
    if (targetDate !== existing.date || targetTime !== existing.time || targetSpecialistId !== existing.specialistId) {
      const conflict = checkAppointmentConflict(appointments, targetSpecialistId, targetDate, targetTime, targetDuration, id);
      if (conflict) {
        showToast(
          `⚠️ Rescheduling conflict: ${conflict.specialistName} already has an appointment with ${conflict.clientName} at ${conflict.time}.`,
          "error",
          5000
        );
        return { success: false, conflict };
      }
    }

    const updatedList = appointments.map((apt) => {
      if (apt.id === id) {
        const specialist = specialists.find((s) => s.id === targetSpecialistId);
        const service = services.find((s) => s.id === (updatedData.serviceId || apt.serviceId));
        return {
          ...apt,
          ...updatedData,
          specialistName: specialist ? specialist.name : apt.specialistName,
          serviceName: service ? service.name : apt.serviceName,
          price: service ? service.price : apt.price,
          room: specialist ? specialist.room : apt.room,
          updatedAt: new Date().toISOString()
        };
      }
      return apt;
    });

    setAppointments(updatedList);
    showToast("✏️ Appointment updated successfully", "success");
    return { success: true };
  }, [appointments, specialists, services, showToast]);

  const updateStatus = useCallback((id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus, updatedAt: new Date().toISOString() } : apt))
    );
    showToast(`Status changed to ${newStatus.toUpperCase()}`, "info");
  }, [showToast]);

  const deleteAppointment = useCallback((id) => {
    // Check permission
    if (!hasPermission("canDeleteAppointments")) {
      showToast("⛔ Permission Denied: Only Clinic Administrators can delete appointments.", "error", 4000);
      return;
    }

    const apt = appointments.find((a) => a.id === id);
    const clientName = apt ? (apt.clientName || apt.name) : "Appointment";

    requestConfirm({
      title: "Delete Appointment",
      message: `Are you sure you want to permanently delete the appointment for "${clientName}"? This action cannot be undone.`,
      confirmText: "Yes, Delete",
      isDanger: true,
      onConfirm: () => {
        setAppointments((prev) => prev.filter((a) => a.id !== id));
        showToast("🗑️ Appointment permanently removed", "info");
        if (activeModalAppointment && activeModalAppointment.id === id) {
          closeDetailModal();
          closeEditModal();
        }
      }
    });
  }, [appointments, hasPermission, requestConfirm, showToast, activeModalAppointment, closeDetailModal, closeEditModal]);

  const loadDemoData = useCallback(() => {
    requestConfirm({
      title: "Load Sample Portfolio Data",
      message: "This will populate the system with 16 realistic medical appointments across multiple specialists and services. Current appointments will be refreshed.",
      confirmText: "Load Demo Data",
      isDanger: false,
      onConfirm: () => {
        const demo = getRealisticDemoAppointments();
        setAppointments(demo);
        setServices(INITIAL_SERVICES);
        setSpecialists(INITIAL_SPECIALISTS);
        showToast("🎉 Loaded 16 realistic demo appointments successfully!", "success");
      }
    });
  }, [requestConfirm, showToast]);

  const clearAllAppointments = useCallback(() => {
    if (!hasPermission("canBackupRestore")) {
      showToast("⛔ Permission Denied: Only Clinic Administrators can clear database records.", "error", 4000);
      return;
    }

    requestConfirm({
      title: "Clear All Appointments",
      message: "Are you sure you want to remove all appointments from storage? This cannot be undone.",
      confirmText: "Clear Everything",
      isDanger: true,
      onConfirm: () => {
        setAppointments([]);
        showToast("🧹 All appointment records cleared", "info");
      }
    });
  }, [hasPermission, requestConfirm, showToast]);

  const importBackupData = useCallback((backupData) => {
    if (!hasPermission("canBackupRestore")) {
      showToast("⛔ Permission Denied: Only Clinic Administrators can restore database backups.", "error", 4000);
      return;
    }

    try {
      if (!backupData || !Array.isArray(backupData.appointments)) {
        throw new Error("Invalid structure: missing appointments array");
      }
      setAppointments(backupData.appointments);
      if (Array.isArray(backupData.services)) setServices(backupData.services);
      if (Array.isArray(backupData.specialists)) setSpecialists(backupData.specialists);
      showToast(`📦 Successfully imported ${backupData.appointments.length} appointments from backup!`, "success");
    } catch (e) {
      showToast(`❌ Import error: ${e.message}`, "error");
    }
  }, [hasPermission, showToast]);

  const value = {
    appointments,
    services,
    specialists,
    darkMode,
    setDarkMode,
    currentRole,
    switchRole,
    hasPermission,
    canAccessView,
    currentView,
    setCurrentView,
    selectedDate,
    setSelectedDate,
    toasts,
    showToast,
    removeToast,
    activeModalAppointment,
    isDetailModalOpen,
    openDetailModal,
    closeDetailModal,
    isEditModalOpen,
    openEditModal,
    closeEditModal,
    isReceiptModalOpen,
    openReceiptModal,
    closeReceiptModal,
    isAuthModalOpen,
    authModalTab,
    setAuthModalTab,
    openAuthModal,
    closeAuthModal,
    isAddStaffModalOpen,
    openAddStaffModal,
    closeAddStaffModal,
    addStaffMember,
    currentUser,
    login,
    signup,
    logout,
    confirmConfig,
    requestConfirm,
    addAppointment,
    updateAppointment,
    updateStatus,
    deleteAppointment,
    loadDemoData,
    clearAllAppointments,
    importBackupData
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};
