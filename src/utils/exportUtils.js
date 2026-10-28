// src/utils/exportUtils.js

/**
 * Clean cell content for CSV escaping
 */
const escapeCSV = (value) => {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
};

/**
 * Export appointments array to structured CSV file
 */
export const exportAppointmentsToCSV = (appointments, filename = "appointments_report.csv") => {
  if (!appointments || appointments.length === 0) {
    alert("No appointments to export.");
    return;
  }

  const headers = [
    "Appointment ID",
    "Reference Code",
    "Client Name",
    "Email",
    "Phone",
    "Service",
    "Specialist",
    "Date",
    "Time",
    "Duration (Mins)",
    "Price ($)",
    "Status",
    "Priority Tag",
    "Room / Location",
    "Created At",
    "Clinical Notes"
  ];

  const rows = appointments.map((apt) => [
    escapeCSV(apt.id),
    escapeCSV(apt.referenceCode || `APT-${apt.id}`),
    escapeCSV(apt.clientName || apt.name),
    escapeCSV(apt.email || "N/A"),
    escapeCSV(apt.phone || "N/A"),
    escapeCSV(apt.serviceName || "Consultation"),
    escapeCSV(apt.specialistName || "Assigned Doctor"),
    escapeCSV(apt.date),
    escapeCSV(apt.time),
    escapeCSV(apt.duration || 30),
    escapeCSV(apt.price || 0),
    escapeCSV(apt.status || "pending"),
    escapeCSV(apt.priority || "Routine"),
    escapeCSV(apt.room || "Suite 101"),
    escapeCSV(apt.createdAt ? new Date(apt.createdAt).toLocaleString() : "N/A"),
    escapeCSV(apt.notes || "")
  ]);

  const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export full application state to JSON backup
 */
export const exportBackupJSON = (data, filename = "medicare_hub_backup.json") => {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Read and validate uploaded JSON backup file
 */
export const readBackupJSON = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file selected"));
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed || !Array.isArray(parsed.appointments)) {
          reject(new Error("Invalid backup file format: missing appointments list"));
          return;
        }
        resolve(parsed);
      } catch (err) {
        reject(new Error("Failed to parse JSON file: " + err.message));
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
};
