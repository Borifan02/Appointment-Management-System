import React, { useState } from "react";

const AppointmentList = ({
  appointments,
  deleteAppointment,
  editAppointment,
  updateStatus,
  clearAppointments,
}) => {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const handleEdit = (apt) => {
    setEditingId(apt.id);
    setEditData(apt);
  };

  const handleSaveEdit = () => {
    editAppointment(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const exportToCSV = () => {
    const headers = ["Name", "Date", "Time", "Email", "Phone", "Status"];
    const rows = filteredAndSorted.map((apt) => [
      apt.name,
      apt.date,
      apt.time,
      apt.email || "",
      apt.phone || "",
      apt.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointments_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filtered = appointments.filter((apt) => {
    const matchesSearch = apt.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const filteredAndSorted = [...filtered].sort((a, b) => {
    if (sortBy === "date") return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  const getStatusBadge = (status) => {
    const badges = {
      pending: "🕐 Pending",
      completed: "✅ Completed",
      cancelled: "❌ Cancelled",
    };
    return badges[status] || status;
  };

  return (
    <div className="container list-container">
      <div className="list-header">
        <h2>📋 Appointments ({filteredAndSorted.length})</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
          {appointments.length > 0 && (
            <>
              <button onClick={exportToCSV} className="btn-export">📥 Export CSV</button>
              <button onClick={clearAppointments} className="btn-danger">🗑️ Clear All</button>
            </>
          )}
        </div>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="empty-state">
          <p>📭 No appointments found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((apt) => (
                <tr key={apt.id} className={`status-${apt.status}`}>
                  <td>
                    {editingId === apt.id ? (
                      <input
                        type="text"
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      />
                    ) : (
                      apt.name
                    )}
                  </td>
                  <td>
                    {editingId === apt.id ? (
                      <input
                        type="date"
                        value={editData.date}
                        onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                      />
                    ) : (
                      apt.date
                    )}
                  </td>
                  <td>
                    {editingId === apt.id ? (
                      <input
                        type="time"
                        value={editData.time}
                        onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                      />
                    ) : (
                      apt.time
                    )}
                  </td>
                  <td>
                    <div className="contact-info">
                      {apt.email && <div>📧 {apt.email}</div>}
                      {apt.phone && <div>📱 {apt.phone}</div>}
                    </div>
                  </td>
                  <td>
                    {editingId === apt.id ? (
                      <select
                        value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${apt.status}`}>
                        {getStatusBadge(apt.status)}
                      </span>
                    )}
                  </td>
                  <td className="actions">
                    {editingId === apt.id ? (
                      <>
                        <button onClick={handleSaveEdit} className="btn-save">💾</button>
                        <button onClick={() => setEditingId(null)} className="btn-cancel">❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(apt)} className="btn-edit">✏️</button>
                        <button onClick={() => window.confirm('Delete this appointment?') && deleteAppointment(apt.id)} className="btn-delete">🗑️</button>
                        {apt.status === "pending" && (
                          <button onClick={() => updateStatus(apt.id, "completed")} className="btn-complete">✅</button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentList;
