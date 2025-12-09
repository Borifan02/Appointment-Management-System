import React from "react";

const Statistics = ({ appointments }) => {
  const total = appointments.length;
  const pending = appointments.filter((apt) => apt.status === "pending").length;
  const completed = appointments.filter((apt) => apt.status === "completed").length;
  const cancelled = appointments.filter((apt) => apt.status === "cancelled").length;

  const today = new Date().toISOString().split("T")[0];
  const upcoming = appointments.filter(
    (apt) => apt.date >= today && apt.status === "pending"
  ).length;

  const stats = [
    { label: "Total", value: total, icon: "📊", color: "#3498db" },
    { label: "Pending", value: pending, icon: "🕐", color: "#f39c12" },
    { label: "Completed", value: completed, icon: "✅", color: "#27ae60" },
    { label: "Cancelled", value: cancelled, icon: "❌", color: "#e74c3c" },
    { label: "Upcoming", value: upcoming, icon: "📅", color: "#9b59b6" },
  ];

  return (
    <div className="statistics">
      {stats.map((stat, index) => (
        <div key={index} className="stat-card" style={{ borderLeftColor: stat.color }}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
