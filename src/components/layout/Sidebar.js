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
    importBackupData,
    clearAllAppointments
  } = useAppointments();

  const fileInputRef = useRef(null);

  const navItems = [
    { id: "dashboard", label: "Executive Dashboard", icon: "📊", badge: null },
    { id: "calendar", label: "Interactive Calendar", icon: "📅", badge: "Live" },
    { id: "appointments", label: "Appointments Registry", icon: "📋", badge: appointments.length },
    { id: "booking", label: "Book Appointment Wizard", icon: "✍️", badge: "New" },
    { id: "roster", label: "Specialists & Services", icon: "👨‍⚕️", badge: specialists.length },
    { id: "analytics", label: "Analytics & Reports", icon: "📈", badge: null }
  ];

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    if (onCloseMobileMenu) onCloseMobileMenu();
  };

  const handleExportBackup = () => {
    const backupState = {
      exportedAt: new Date().toISOString(),
      version: "2.0.0",
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
    // reset input so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <aside className={`main-sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-section-title">MAIN NAVIGATION</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => {
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
                <span className={`nav-item-badge ${item.id === "booking" ? "badge-accent" : ""}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <div className="sidebar-section-title">DATA MANAGEMENT</div>
      <div className="sidebar-actions">
        <button
          className="sidebar-btn-action"
          onClick={handleExportBackup}
          title="Download a full JSON backup of all appointments and configurations"
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

      <div className="sidebar-footer">
        <div className="system-pill">
          <span className="pulse-dot" />
          <span>v2.4 Enterprise Edition</span>
        </div>
        <p className="system-author">Portfolio Showcase Build</p>
      </div>
    </aside>
  );
};

export default Sidebar;
