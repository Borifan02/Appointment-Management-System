// src/data/roles.js
export const SYSTEM_ROLES = {
  admin: {
    id: "admin",
    name: "Dr. Catherine Hayes",
    roleLabel: "Clinic Director (Admin)",
    badgeClass: "role-badge-admin",
    icon: "🛡️",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
    description: "Full operational access: financial revenue analytics, all physician schedules, system backups, and database administration.",
    allowedViews: ["dashboard", "calendar", "appointments", "booking", "roster", "analytics"],
    defaultView: "dashboard",
    permissions: {
      canViewFinancials: true,
      canDeleteAppointments: true,
      canEditClinicalNotes: true,
      canBackupRestore: true,
      canChangeStatus: true,
      canViewAllPatients: true,
      canManageRoster: true
    }
  },
  doctor: {
    id: "doctor",
    name: "Dr. Evelyn Reed",
    roleLabel: "Senior Physician",
    specialistId: "spec-1", // Links to Dr. Evelyn Reed in specialists.js
    badgeClass: "role-badge-doctor",
    icon: "👨‍⚕️",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120&auto=format&fit=crop&q=80",
    description: "Physician portal: access to personal calendar, assigned patients, clinical diagnosis notes, and patient consultation records.",
    allowedViews: ["dashboard", "calendar", "appointments", "roster"],
    defaultView: "dashboard",
    permissions: {
      canViewFinancials: false,
      canDeleteAppointments: false,
      canEditClinicalNotes: true,
      canBackupRestore: false,
      canChangeStatus: true,
      canViewAllPatients: false,
      canManageRoster: false
    }
  },
  receptionist: {
    id: "receptionist",
    name: "Sarah Jenkins",
    roleLabel: "Receptionist / Front Desk",
    badgeClass: "role-badge-receptionist",
    icon: "📋",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
    description: "Front-desk operations: patient check-in, today's schedule timeline, appointment scheduling, and official visit slip printing.",
    allowedViews: ["dashboard", "calendar", "appointments", "booking", "roster"],
    defaultView: "dashboard",
    permissions: {
      canViewFinancials: false,
      canDeleteAppointments: false,
      canEditClinicalNotes: false,
      canBackupRestore: false,
      canChangeStatus: true,
      canViewAllPatients: true,
      canManageRoster: false
    }
  },
  patient: {
    id: "patient",
    name: "Eleanor Vance",
    roleLabel: "Patient Portal",
    clientEmail: "eleanor.vance@example.com",
    badgeClass: "role-badge-patient",
    icon: "👤",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    description: "Patient client portal: self-service consultation booking, personal upcoming visits, calendar passes (.ICS), and printable slips.",
    allowedViews: ["patient-portal", "booking"],
    defaultView: "patient-portal",
    permissions: {
      canViewFinancials: false,
      canDeleteAppointments: false,
      canEditClinicalNotes: false,
      canBackupRestore: false,
      canChangeStatus: false,
      canViewAllPatients: false,
      canManageRoster: false
    }
  }
};
