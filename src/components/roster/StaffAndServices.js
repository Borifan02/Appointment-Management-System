// src/components/roster/StaffAndServices.js
import React, { useState } from "react";
import { useAppointments } from "../../context/AppointmentContext";

const StaffAndServices = ({ onSelectSpecialistForBooking, onSelectServiceForBooking }) => {
  const { specialists, services, appointments, setCurrentView } = useAppointments();
  const [activeTab, setActiveTab] = useState("specialists"); // 'specialists' | 'services'
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSpecialists = specialists.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredServices = services.filter(
    (srv) =>
      srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="roster-view-container">
      {/* Top Header */}
      <div className="roster-header">
        <div className="roster-header-text">
          <h2>👨‍⚕️ Clinical Directory & Service Catalog</h2>
          <p>Explore healthcare practitioners, operational hours, and available clinical offerings.</p>
        </div>

        <div className="roster-tabs-switch">
          <button
            className={`roster-tab-btn ${activeTab === "specialists" ? "active" : ""}`}
            onClick={() => setActiveTab("specialists")}
          >
            Specialists Roster ({specialists.length})
          </button>
          <button
            className={`roster-tab-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services Catalog ({services.length})
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="roster-search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={`Search ${activeTab === "specialists" ? "physicians by name, specialty, role..." : "services by name, category..."}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button className="search-clear-btn" onClick={() => setSearchTerm("")}>
            ✕
          </button>
        )}
      </div>

      {/* Specialists Tab */}
      {activeTab === "specialists" && (
        <div className="specialists-cards-grid">
          {filteredSpecialists.map((spec) => {
            const specAppointments = appointments.filter(
              (a) => a.specialistId === spec.id && a.status !== "cancelled"
            );

            return (
              <div key={spec.id} className="specialist-profile-card">
                <div className="spec-card-header">
                  <img src={spec.avatar} alt={spec.name} className="spec-large-avatar" />
                  <div className="spec-rating-pill">★ {spec.rating} ({spec.reviewsCount} reviews)</div>
                </div>

                <div className="spec-card-body">
                  <h3 className="spec-name">{spec.name}</h3>
                  <span className="spec-role-tag">{spec.role}</span>
                  <p className="spec-specialty-text">{spec.specialty}</p>

                  <div className="spec-details-list">
                    <div className="spec-detail-row">
                      <span className="detail-icon">🎓</span>
                      <span>{spec.experienceYears} Years Clinical Experience</span>
                    </div>
                    <div className="spec-detail-row">
                      <span className="detail-icon">📍</span>
                      <span>{spec.room}</span>
                    </div>
                    <div className="spec-detail-row">
                      <span className="detail-icon">🕒</span>
                      <span>
                        {spec.workingHours?.start} - {spec.workingHours?.end} ({spec.workingDays?.slice(0, 3).join(", ")}...)
                      </span>
                    </div>
                    <div className="spec-detail-row">
                      <span className="detail-icon">📞</span>
                      <span>{spec.phone}</span>
                    </div>
                  </div>

                  <div className="spec-active-badge">
                    <span>📅 {specAppointments.length} Bookings scheduled</span>
                  </div>
                </div>

                <div className="spec-card-footer">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      if (onSelectSpecialistForBooking) onSelectSpecialistForBooking(spec.id);
                      setCurrentView("booking");
                    }}
                  >
                    Book with {spec.name.split(" ")[1] || spec.name} →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Services Tab */}
      {activeTab === "services" && (
        <div className="services-catalog-grid">
          {filteredServices.map((srv) => {
            const srvCount = appointments.filter((a) => a.serviceId === srv.id).length;

            return (
              <div key={srv.id} className="service-catalog-card">
                <div className="service-catalog-top">
                  <span className="service-category-badge">{srv.category}</span>
                  <span className="service-price-badge">${srv.price}</span>
                </div>

                <h3 className="service-card-title">{srv.name}</h3>
                <p className="service-card-desc">{srv.description}</p>

                <div className="service-card-meta">
                  <span className="meta-pill">⏱️ {srv.duration} mins duration</span>
                  <span className="meta-pill">📊 {srvCount} booked total</span>
                </div>

                <div className="service-catalog-footer">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => {
                      if (onSelectServiceForBooking) onSelectServiceForBooking(srv.id);
                      setCurrentView("booking");
                    }}
                  >
                    Schedule This Service →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StaffAndServices;
