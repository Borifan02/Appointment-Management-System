// src/components/analytics/AnalyticsView.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { STATUS_CONFIG } from "../../utils/calendarUtils";

const AnalyticsView = () => {
  const { appointments, services, specialists } = useAppointments();

  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;
  const pending = appointments.filter((a) => a.status === "pending").length;
  const inProgress = appointments.filter((a) => a.status === "in-progress").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;
  const noShow = appointments.filter((a) => a.status === "no-show").length;

  const totalRevenue = appointments
    .filter((a) => a.status === "completed" || a.status === "confirmed")
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const realizedRevenue = appointments
    .filter((a) => a.status === "completed")
    .reduce((sum, a) => sum + (Number(a.price) || 0), 0);

  const avgValue = total > 0 ? Math.round(totalRevenue / (completed + confirmed || 1)) : 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const cancelRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  // Breakdown by Service
  const serviceStats = services.map((srv) => {
    const srvApts = appointments.filter((a) => a.serviceId === srv.id);
    const rev = srvApts
      .filter((a) => a.status === "completed" || a.status === "confirmed")
      .reduce((sum, a) => sum + (Number(a.price) || 0), 0);
    return {
      id: srv.id,
      name: srv.name,
      category: srv.category,
      count: srvApts.length,
      revenue: rev,
      percentage: total > 0 ? Math.round((srvApts.length / total) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // Breakdown by Specialist
  const specialistStats = specialists.map((spec) => {
    const specApts = appointments.filter((a) => a.specialistId === spec.id);
    return {
      id: spec.id,
      name: spec.name,
      role: spec.role,
      specialty: spec.specialty,
      avatar: spec.avatar,
      count: specApts.length,
      percentage: total > 0 ? Math.round((specApts.length / total) * 100) : 0
    };
  }).sort((a, b) => b.count - a.count);

  // Time Distribution (Morning vs Mid-Day vs Afternoon)
  const morningCount = appointments.filter((a) => a.time < "12:00").length;
  const afternoonCount = appointments.filter((a) => a.time >= "12:00" && a.time < "15:00").length;
  const eveningCount = appointments.filter((a) => a.time >= "15:00").length;

  return (
    <div className="analytics-view">
      <div className="analytics-hero">
        <h2>📈 Clinical & Financial Performance Analytics</h2>
        <p>Comprehensive insights on appointment volumes, revenue generation, and provider utilization.</p>
      </div>

      {/* Financial KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card" style={{ borderTop: "4px solid #10b981" }}>
          <div className="kpi-top">
            <span className="kpi-title">Gross Booked Value</span>
            <span className="kpi-icon">💰</span>
          </div>
          <div className="kpi-value">${totalRevenue.toLocaleString()}</div>
          <div className="kpi-subtext">${realizedRevenue.toLocaleString()} realized (completed)</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #3b82f6" }}>
          <div className="kpi-top">
            <span className="kpi-title">Average Ticket Size</span>
            <span className="kpi-icon">💳</span>
          </div>
          <div className="kpi-value">${avgValue}</div>
          <div className="kpi-subtext">Per confirmed consultation</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #8b5cf6" }}>
          <div className="kpi-top">
            <span className="kpi-title">Completion Rate</span>
            <span className="kpi-icon">🎯</span>
          </div>
          <div className="kpi-value">{completionRate}%</div>
          <div className="kpi-subtext">{completed} visits fulfilled</div>
        </div>

        <div className="kpi-card" style={{ borderTop: "4px solid #ef4444" }}>
          <div className="kpi-top">
            <span className="kpi-title">Attrition / Cancellation</span>
            <span className="kpi-icon">📉</span>
          </div>
          <div className="kpi-value">{cancelRate}%</div>
          <div className="kpi-subtext">{cancelled} cancelled, {noShow} no-shows</div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="analytics-charts-grid">
        {/* Status Distribution Visual Chart */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>📊 Appointment Status Distribution</h3>
            <span className="card-badge">{total} Total</span>
          </div>
          <div className="status-chart-body">
            <div className="status-visual-bar-wrap">
              <div className="segmented-progress-bar">
                {total > 0 ? (
                  <>
                    <div
                      className="segment"
                      style={{
                        width: `${(completed / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG.completed.color
                      }}
                      title={`Completed: ${completed}`}
                    />
                    <div
                      className="segment"
                      style={{
                        width: `${(confirmed / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG.confirmed.color
                      }}
                      title={`Confirmed: ${confirmed}`}
                    />
                    <div
                      className="segment"
                      style={{
                        width: `${(inProgress / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG["in-progress"].color
                      }}
                      title={`In Progress: ${inProgress}`}
                    />
                    <div
                      className="segment"
                      style={{
                        width: `${(pending / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG.pending.color
                      }}
                      title={`Pending: ${pending}`}
                    />
                    <div
                      className="segment"
                      style={{
                        width: `${(cancelled / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG.cancelled.color
                      }}
                      title={`Cancelled: ${cancelled}`}
                    />
                    <div
                      className="segment"
                      style={{
                        width: `${(noShow / total) * 100}%`,
                        backgroundColor: STATUS_CONFIG["no-show"].color
                      }}
                      title={`No-Show: ${noShow}`}
                    />
                  </>
                ) : (
                  <div className="segment" style={{ width: "100%", backgroundColor: "#e2e8f0" }} />
                )}
              </div>
            </div>

            <div className="status-legend-grid">
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG.completed.color }} />
                <span className="legend-name">Completed</span>
                <span className="legend-val">{completed} ({total > 0 ? Math.round((completed / total) * 100) : 0}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG.confirmed.color }} />
                <span className="legend-name">Confirmed</span>
                <span className="legend-val">{confirmed} ({total > 0 ? Math.round((confirmed / total) * 100) : 0}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG["in-progress"].color }} />
                <span className="legend-name">In Progress</span>
                <span className="legend-val">{inProgress} ({total > 0 ? Math.round((inProgress / total) * 100) : 0}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG.pending.color }} />
                <span className="legend-name">Pending</span>
                <span className="legend-val">{pending} ({total > 0 ? Math.round((pending / total) * 100) : 0}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG.cancelled.color }} />
                <span className="legend-name">Cancelled</span>
                <span className="legend-val">{cancelled} ({total > 0 ? Math.round((cancelled / total) * 100) : 0}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: STATUS_CONFIG["no-show"].color }} />
                <span className="legend-name">No-Show</span>
                <span className="legend-val">{noShow} ({total > 0 ? Math.round((noShow / total) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peak Hours Distribution */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>⏰ Schedule Load by Time of Day</h3>
            <span className="card-badge">Daily Heatmap</span>
          </div>
          <div className="time-heat-body">
            <div className="time-block-bar">
              <div className="time-block-label">
                <span>Morning (08:00 - 12:00)</span>
                <strong>{morningCount} bookings ({total > 0 ? Math.round((morningCount / total) * 100) : 0}%)</strong>
              </div>
              <div className="time-bar-outer">
                <div
                  className="time-bar-inner morning-bar"
                  style={{ width: `${total > 0 ? (morningCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="time-block-bar">
              <div className="time-block-label">
                <span>Mid-Day (12:00 - 15:00)</span>
                <strong>{afternoonCount} bookings ({total > 0 ? Math.round((afternoonCount / total) * 100) : 0}%)</strong>
              </div>
              <div className="time-bar-outer">
                <div
                  className="time-bar-inner afternoon-bar"
                  style={{ width: `${total > 0 ? (afternoonCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="time-block-bar">
              <div className="time-block-label">
                <span>Late Afternoon (15:00 - 18:00)</span>
                <strong>{eveningCount} bookings ({total > 0 ? Math.round((eveningCount / total) * 100) : 0}%)</strong>
              </div>
              <div className="time-bar-outer">
                <div
                  className="time-bar-inner evening-bar"
                  style={{ width: `${total > 0 ? (eveningCount / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Volume by Medical Service */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>🩺 Service Demand & Revenue</h3>
            <span className="card-badge">{services.length} Services</span>
          </div>
          <div className="service-breakdown-list">
            {serviceStats.map((srv) => (
              <div key={srv.id} className="service-stat-row">
                <div className="service-stat-info">
                  <span className="srv-title">{srv.name}</span>
                  <span className="srv-meta">{srv.count} visits • ${srv.revenue} generated</span>
                </div>
                <div className="service-progress-wrap">
                  <div className="service-progress-fill" style={{ width: `${srv.percentage}%` }} />
                </div>
                <span className="srv-percent">{srv.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Provider Utilization */}
        <div className="analytics-card">
          <div className="card-header">
            <h3>👨‍⚕️ Provider Workload Distribution</h3>
            <span className="card-badge">{specialists.length} Specialists</span>
          </div>
          <div className="specialist-workload-list">
            {specialistStats.map((spec) => (
              <div key={spec.id} className="specialist-workload-row">
                <img src={spec.avatar} alt={spec.name} className="workload-avatar" />
                <div className="workload-info">
                  <span className="workload-name">{spec.name}</span>
                  <span className="workload-role">{spec.specialty}</span>
                </div>
                <div className="workload-bar-wrap">
                  <div className="workload-bar-fill" style={{ width: `${spec.percentage}%` }} />
                </div>
                <span className="workload-count">{spec.count} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
