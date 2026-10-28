// src/components/common/ConfirmModal.js
import React, { useEffect } from "react";
import { useAppointments } from "../../context/AppointmentContext";

const ConfirmModal = () => {
  const { confirmConfig } = useAppointments();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!confirmConfig) return;
      if (e.key === "Escape") confirmConfig.onCancel();
      if (e.key === "Enter") confirmConfig.onConfirm();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmConfig]);

  if (!confirmConfig) return null;

  const { title, message, onConfirm, onCancel, confirmText = "Confirm", isDanger = false } = confirmConfig;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-card confirm-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-title">
            <span className="modal-icon">{isDanger ? "⚠️" : "❓"}</span>
            <h3>{title}</h3>
          </div>
          <button className="btn-modal-close" onClick={onCancel}>×</button>
        </div>
        <div className="modal-body">
          <p className="confirm-text">{message}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? "btn-danger" : "btn-primary"}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
