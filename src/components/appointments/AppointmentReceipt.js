// src/components/appointments/AppointmentReceipt.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";
import { formatReadableDate, formatReadableTime } from "../../utils/calendarUtils";

const AppointmentReceipt = () => {
  const { activeModalAppointment, isReceiptModalOpen, closeReceiptModal } = useAppointments();

  if (!isReceiptModalOpen || !activeModalAppointment) return null;

  const apt = activeModalAppointment;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop receipt-modal-backdrop" onClick={closeReceiptModal}>
      <div className="modal-card receipt-card-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="receipt-print-actions">
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            🖨️ Print Slip / Save PDF
          </button>
          <button className="btn btn-secondary btn-sm" onClick={closeReceiptModal}>
            ✕ Close
          </button>
        </div>

        {/* Printable Pass Area */}
        <div className="printable-slip" id="printable-appointment-slip">
          <div className="slip-header">
            <div className="slip-brand">
              <span className="slip-logo">🏥</span>
              <div>
                <h2>MediCare Hub Health Center</h2>
                <p>742 Evergreen Boulevard, Suite 500 • Tel: +1 (555) 800-CARE</p>
              </div>
            </div>
            <div className="slip-badge">
              <span>VISIT PASS</span>
            </div>
          </div>

          <div className="slip-divider" />

          <div className="slip-ref-banner">
            <div className="ref-info">
              <span className="ref-label">APPOINTMENT REFERENCE</span>
              <span className="ref-code">{apt.referenceCode || `MED-${apt.id.slice(-4)}`}</span>
            </div>
            {/* SVG Barcode Representation */}
            <div className="barcode-box">
              <svg className="barcode-svg" width="160" height="40" viewBox="0 0 160 40">
                <rect x="0" y="0" width="3" height="40" fill="#111" />
                <rect x="5" y="0" width="2" height="40" fill="#111" />
                <rect x="9" y="0" width="4" height="40" fill="#111" />
                <rect x="16" y="0" width="1" height="40" fill="#111" />
                <rect x="19" y="0" width="5" height="40" fill="#111" />
                <rect x="27" y="0" width="2" height="40" fill="#111" />
                <rect x="32" y="0" width="3" height="40" fill="#111" />
                <rect x="38" y="0" width="1" height="40" fill="#111" />
                <rect x="42" y="0" width="4" height="40" fill="#111" />
                <rect x="49" y="0" width="2" height="40" fill="#111" />
                <rect x="54" y="0" width="6" height="40" fill="#111" />
                <rect x="63" y="0" width="2" height="40" fill="#111" />
                <rect x="68" y="0" width="3" height="40" fill="#111" />
                <rect x="74" y="0" width="5" height="40" fill="#111" />
                <rect x="82" y="0" width="1" height="40" fill="#111" />
                <rect x="86" y="0" width="4" height="40" fill="#111" />
                <rect x="93" y="0" width="2" height="40" fill="#111" />
                <rect x="98" y="0" width="5" height="40" fill="#111" />
                <rect x="106" y="0" width="2" height="40" fill="#111" />
                <rect x="111" y="0" width="4" height="40" fill="#111" />
                <rect x="118" y="0" width="2" height="40" fill="#111" />
                <rect x="123" y="0" width="5" height="40" fill="#111" />
                <rect x="131" y="0" width="2" height="40" fill="#111" />
                <rect x="136" y="0" width="4" height="40" fill="#111" />
                <rect x="143" y="0" width="2" height="40" fill="#111" />
                <rect x="148" y="0" width="5" height="40" fill="#111" />
                <rect x="156" y="0" width="2" height="40" fill="#111" />
              </svg>
              <span className="barcode-text">{apt.referenceCode}</span>
            </div>
          </div>

          <div className="slip-grid">
            <div className="slip-item">
              <span className="slip-label">PATIENT NAME</span>
              <span className="slip-val">{apt.clientName || apt.name}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">CONTACT PHONE</span>
              <span className="slip-val">{apt.phone || "N/A"}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">APPOINTMENT DATE</span>
              <span className="slip-val font-bold">{formatReadableDate(apt.date)}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">REPORT TIME</span>
              <span className="slip-val font-bold">{formatReadableTime(apt.time)}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">SPECIALIST PHYSICIAN</span>
              <span className="slip-val">{apt.specialistName}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">CONSULTATION / SERVICE</span>
              <span className="slip-val">{apt.serviceName}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">LOCATION & ROOM</span>
              <span className="slip-val">{apt.room || "Suite 101 - Primary Wing"}</span>
            </div>
            <div className="slip-item">
              <span className="slip-label">SESSION DURATION</span>
              <span className="slip-val">{apt.duration || 30} Minutes</span>
            </div>
          </div>

          <div className="slip-fee-strip">
            <span>CONSULTATION FEE DUE:</span>
            <span className="fee-amount">${apt.price || 0}.00</span>
          </div>

          <div className="slip-instructions">
            <h4>Patient Notice & Instructions:</h4>
            <ul>
              <li>Please arrive 10-15 minutes prior to your scheduled time for vitals check-in.</li>
              <li>Present this confirmation slip and valid photo identification at Reception.</li>
              <li>To reschedule or cancel without penalty, please notify 24 hours in advance.</li>
            </ul>
          </div>

          <div className="slip-footer">
            <span>Generated on {new Date().toLocaleString()}</span>
            <span>MediCare Hub Electronic Management Record</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentReceipt;
