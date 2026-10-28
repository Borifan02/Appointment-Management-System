// src/components/layout/Sidebar.js
import React, { useRef } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { exportBackupJSON, readBackupJSON } from "../../utils/exportUtils";

const Sidebar = ({ isOpen, onCloseMobileMenu }) => {
  const {
    currentView,
    setCurrentView,
    appointments,
    services,
    specialists,
    currentRole,
    canAccessView,
    hasPermission,
    importBackupData,
    clearAllAppointments,
    openAuthModal
  } = useAppointments();

  const fileInputRef = useRef(null);

  // All possible navigation items
  const allNavItems = [
    { id: "patient-portal", label: "My Patient Portal", icon: "👤", badge: "Personal" },
    { id: "dashboard", label: "Executive Dashboard", icon: "📊", badge: null },
    { id: "calendar", label: "Interactive Calendar", icon: "📅", badge: "Live" },
    { id: "appointments", label: "Appointments Registry", icon: "📋", badge: appointments.length },
    { id: "booking", label: "Book Appointment Wizard", icon: "✍️", badge: "New" },
    { id: "roster", label: "Specialists & Services", icon: "👨‍⚕️", badge: specialists.length },
    { id: "analytics", label: "Analytics & Reports", icon: "📈", badge: "Admin" }
  ];

  // Filter navigation items by current role's allowed views
  const allowedNavItems = allNavItems.filter((item) => canAccessView(item.id));

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleExportBackup = () => {
    const backupState = {
      exportedAt: new Date().toISOString(),
      version: "2.4.0",
      appointments,
      services,
      specialists
    };
    exportBackupJSON(backupState, `medicare_backup_${new Date().toISOString().split("T")[0]}.json`);
  };

  const handleImportFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      try {
        const data = await readBackupJSON(file);
        importBackupData(data);
      } catch (err) {
        alert("Failed to restore: " + err.message);
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <aside className={`main-sidebar ${isOpen ? "open" : ""}`}>
      {/* Active User Card */}
      <div className="sidebar-role-indicator-card">
        <img src={currentRole.avatar} alt={currentRole.name} className="sidebar-user-avatar" />
        <div className="sidebar-user-info">
          <span className="sidebar-user-name">{currentRole.name}</span>
          <span className={`role-badge-chip ${currentRole.badgeClass}`}>
            {currentRole.icon} {currentRole.roleLabel}
          </span>
        </div>
        <button
          type="button"
          className="sidebar-user-switch-btn"
          onClick={() => openAuthModal("login")}
          title="Sign In or Switch Account"
          aria-label="Sign In or Switch Account"
        >
          🔑
        </button>
      </div>

      <div className="sidebar-section-title">AUTHORIZED MODULES</div>
      <nav className="sidebar-nav">
        {allowedNavItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              <span className="nav-item-icon">{item.icon}</span>
              <span className="nav-item-label">{item.label}</span>
              {item.badge !== null && (
                <span
                  className={`nav-item-badge ${
                    item.id === "booking" || item.id === "patient-portal" ? "badge-accent" : ""
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Admin-only Database Tools */}
      {hasPermission("canBackupRestore") && (
        <>
          <div className="sidebar-divider" />
          <div className="sidebar-section-title">ADMIN DATA MANAGEMENT</div>
          <div className="sidebar-actions">
            <button
              className="sidebar-btn-action"
              onClick={handleExportBackup}
              title="Download a full JSON backup of appointments"
            >
              <span>💾</span> Export Backup JSON
            </button>

            <button
              className="sidebar-btn-action"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
              title="Restore appointments from a saved JSON backup"
            >
              <span>📥</span> Import Backup JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: "none" }}
              onChange={handleImportFileChange}
            />

            <button
              className="sidebar-btn-action sidebar-btn-danger"
              onClick={clearAllAppointments}
              title="Reset appointment database"
            >
              <span>🧹</span> Clear All Data
            </button>
          </div>
        </>
      )}

      {/* Role Permissions Brief */}
      <div className="sidebar-footer">
        <div className="permissions-summary-box">
          <span className="permissions-title">ROLE ACCESS LEVEL:</span>
          <p className="permissions-desc">
            {currentRole.id === "admin" && "Full administrative privileges & financial access"}
            {currentRole.id === "doctor" && "Restricted to Dr. Evelyn Reed's schedule & clinical notes"}
            {currentRole.id === "receptionist" && "Patient intake & scheduling (financials restricted)"}
            {currentRole.id === "patient" && "Client self-service portal & personal passes only"}
          </p>
        </div>

        <div className="system-pill">
          <span className="pulse-dot" />
          <span>RBAC v2.4 Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
