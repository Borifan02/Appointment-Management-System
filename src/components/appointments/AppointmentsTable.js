// src/components/appointments/AppointmentsTable.js
import React, { useState, useMemo } from "react";
import { useAppointments } from "../../context/AppointmentContext";
import {
  toISODate,
  formatReadableDate,
  formatReadableTime,
  STATUS_CONFIG,
  downloadICS
} from "../../utils/calendarUtils";
import { exportAppointmentsToCSV } from "../../utils/exportUtils";

const AppointmentsTable = () => {
  const {
    appointments,
    specialists,
    currentRole,
    hasPermission,
    updateStatus,
    deleteAppointment,
    openDetailModal,
    openEditModal,
    openReceiptModal,
    setCurrentView,
    loadDemoData
  } = useAppointments();

  // If active role is a doctor, default specialist filter to that doctor
  const defaultSpecialist = currentRole.specialistId || "all";

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [specialistFilter, setSpecialistFilter] = useState(defaultSpecialist);
  const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'upcoming', 'past'
  const [sortBy, setSortBy] = useState("date-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const todayStr = toISODate(new Date());

  // Filter and sort pipeline
  const filteredAndSorted = useMemo(() => {
    return appointments
      .filter((apt) => {
        // Search across patient, phone, email, notes, reference
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          !term ||
          (apt.clientName || apt.name || "").toLowerCase().includes(term) ||
          (apt.email || "").toLowerCase().includes(term) ||
          (apt.phone || "").toLowerCase().includes(term) ||
          (apt.referenceCode || "").toLowerCase().includes(term) ||
          (apt.serviceName || "").toLowerCase().includes(term) ||
          (apt.notes || "").toLowerCase().includes(term);

        // Status filter
        const matchesStatus = statusFilter === "all" || apt.status === statusFilter;

        // Specialist filter (locked if doctor role)
        const effectiveSpecialistFilter = currentRole.specialistId || specialistFilter;
        const matchesSpecialist =
          effectiveSpecialistFilter === "all" || apt.specialistId === effectiveSpecialistFilter;

        // Date filter
        let matchesDate = true;
        if (dateFilter === "today") {
          matchesDate = apt.date === todayStr;
        } else if (dateFilter === "upcoming") {
          matchesDate = apt.date >= todayStr;
        } else if (dateFilter === "past") {
          matchesDate = apt.date < todayStr;
        }

        return matchesSearch && matchesStatus && matchesSpecialist && matchesDate;
      })
      .sort((a, b) => {
        if (sortBy === "date-asc") {
          return (a.date + a.time).localeCompare(b.date + b.time);
        }
        if (sortBy === "date-desc") {
          return (b.date + b.time).localeCompare(a.date + a.time);
        }
        if (sortBy === "name-asc") {
          return (a.clientName || a.name).localeCompare(b.clientName || b.name);
        }
        if (sortBy === "price-desc") {
          return (b.price || 0) - (a.price || 0);
        }
        if (sortBy === "status") {
          return a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [appointments, searchTerm, statusFilter, specialistFilter, dateFilter, sortBy, todayStr, currentRole.specialistId]);

  // Pagination calculation
  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAppointments = filteredAndSorted.slice(startIndex, startIndex + pageSize);

  const handleExport = () => {
    exportAppointmentsToCSV(
      filteredAndSorted,
      `appointments_registry_${new Date().toISOString().split("T")[0]}.csv`
    );
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSpecialistFilter(currentRole.specialistId || "all");
    setDateFilter("all");
    setSortBy("date-asc");
    setCurrentPage(1);
  };

  return (
    <div className="registry-container">
      {/* Top Header */}
      <div className="registry-header">
        <div className="registry-title-wrap">
          <h2>📋 Appointments Registry</h2>
          <span className="count-pill">
            Showing {filteredAndSorted.length} of {appointments.length}
          </span>
          {currentRole.specialistId && (
            <span className="role-filter-indicator">
              Filtered for: <strong>{currentRole.name}</strong>
            </span>
          )}
        </div>

        <div className="registry-header-actions">
          <button className="btn btn-outline" onClick={handleExport} title="Export filtered records to CSV">
            <span>📥</span> Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setCurrentView("booking")}>
            <span>➕</span> New Appointment
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="registry-filter-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search patient, phone, email, notes, ref..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-group">
          {/* Status filter */}
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No-Show</option>
          </select>

          {/* Specialist filter (Disabled if doctor role) */}
          {!currentRole.specialistId ? (
            <select
              className="filter-select"
              value={specialistFilter}
              onChange={(e) => {
                setSpecialistFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Specialists</option>
              {specialists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          ) : (
            <span className="filter-locked-badge">👨‍⚕️ {currentRole.name}</span>
          )}

          {/* Date range filter */}
          <select
            className="filter-select"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">All Dates</option>
            <option value="today">Today Only</option>
            <option value="upcoming">Upcoming & Future</option>
            <option value="past">Past Records</option>
          </select>

          {/* Sort order */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Date & Time (Earliest first)</option>
            <option value="date-desc">Date & Time (Latest first)</option>
            <option value="name-asc">Patient Name (A-Z)</option>
            <option value="price-desc">Highest Fee</option>
            <option value="status">By Status</option>
          </select>

          {(searchTerm || statusFilter !== "all" || (!currentRole.specialistId && specialistFilter !== "all") || dateFilter !== "all") && (
            <button className="btn-link-reset" onClick={handleResetFilters}>
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      {paginatedAppointments.length === 0 ? (
        <div className="registry-empty-state">
          <span className="empty-icon">🔍</span>
          <h3>No matching appointment records found</h3>
          <p>Try adjusting your search query, status filters, or date range.</p>
          <div className="empty-state-buttons">
            <button className="btn btn-secondary" onClick={handleResetFilters}>
              Reset Filters
            </button>
            {hasPermission("canBackupRestore") && (
              <button className="btn btn-primary" onClick={loadDemoData}>
                Load Sample Data
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="table-responsive-wrapper">
          <table className="medicare-table">
            <thead>
              <tr>
                <th>Patient / Ref</th>
                <th>Contact</th>
                <th>Service & Fee</th>
                <th>Specialist & Room</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.map((apt) => {
                const statusInfo = STATUS_CONFIG[apt.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={apt.id} className={`table-row-${apt.status}`}>
                    {/* Patient & Ref */}
                    <td>
                      <div className="patient-cell">
                        <span className="patient-name-primary" onClick={() => openDetailModal(apt)}>
                          {apt.clientName || apt.name}
                        </span>
                        <div className="patient-sub-badges">
                          <span className="ref-badge">{apt.referenceCode || `REF-${apt.id.slice(-4)}`}</span>
                          {apt.priority && (
                            <span className={`priority-tag tag-${apt.priority.toLowerCase()}`}>
                              {apt.priority}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td>
                      <div className="contact-cell">
                        {apt.email && (
                          <a href={`mailto:${apt.email}`} className="contact-link" title="Send email">
                            ✉️ {apt.email}
                          </a>
                        )}
                        {apt.phone && (
                          <a href={`tel:${apt.phone}`} className="contact-link" title="Call patient">
                            📞 {apt.phone}
                          </a>
                        )}
                        {!apt.email && !apt.phone && <span className="text-muted">No contact info</span>}
                      </div>
                    </td>

                    {/* Service & Fee */}
                    <td>
                      <div className="service-cell">
                        <span className="service-name-bold">{apt.serviceName}</span>
                        <span className="service-meta-sub">
                          {apt.duration || 30} mins • <strong>${apt.price || 0}</strong>
                        </span>
                      </div>
                    </td>

                    {/* Specialist */}
                    <td>
                      <div className="specialist-cell">
                        <span className="spec-name">{apt.specialistName}</span>
                        <span className="room-label">📍 {apt.room || "Suite 101"}</span>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td>
                      <div className="datetime-cell">
                        <span className="date-main">{formatReadableDate(apt.date)}</span>
                        <span className="time-sub">⏰ {formatReadableTime(apt.time)}</span>
                      </div>
                    </td>

                    {/* Status Dropdown */}
                    <td>
                      <select
                        className="status-dropdown-badge"
                        style={{
                          backgroundColor: statusInfo.bgColor,
                          color: statusInfo.color,
                          borderColor: statusInfo.borderColor
                        }}
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="no-show">No-Show</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="text-right">
                      <div className="row-actions">
                        <button
                          className="btn-icon-action"
                          onClick={() => openDetailModal(apt)}
                          title="View Complete Clinical Details"
                        >
                          👁️
                        </button>

                        <button
                          className="btn-icon-action"
                          onClick={() => openEditModal(apt)}
                          title="Edit / Reschedule"
                        >
                          ✏️
                        </button>

                        <button
                          className="btn-icon-action"
                          onClick={() => downloadICS(apt)}
                          title="Download iCalendar file (.ics)"
                        >
                          📅
                        </button>

                        <button
                          className="btn-icon-action"
                          onClick={() => openReceiptModal(apt)}
                          title="Print Patient Slip"
                        >
                          🖨️
                        </button>

                        {/* Delete button only visible to users with permission (Admin) */}
                        {hasPermission("canDeleteAppointments") && (
                          <button
                            className="btn-icon-action btn-icon-delete"
                            onClick={() => deleteAppointment(apt.id)}
                            title="Delete appointment (Admin only)"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="pagination-bar">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, totalItems)} of {totalItems} entries
          </div>

          <div className="pagination-controls">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`page-btn ${num === currentPage ? "active" : ""}`}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>

          <div className="page-size-selector">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;
