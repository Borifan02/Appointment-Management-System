// src/components/common/Toast.js
import React from "react";
import { useAppointments } from "../../context/AppointmentContext";

const ToastContainer = () => {
  const { toasts, removeToast } = useAppointments();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-portal" aria-live="polite">
      {toasts.map((toast) => {
        let icon = "ℹ️";
        let modifier = "toast-info";
        if (toast.type === "success") {
          icon = "✅";
          modifier = "toast-success";
        } else if (toast.type === "error") {
          icon = "⚠️";
          modifier = "toast-error";
        } else if (toast.type === "warning") {
          icon = "🔔";
          modifier = "toast-warning";
        }

        return (
          <div key={toast.id} className={`toast-card ${modifier} animate-slide-in`}>
            <div className="toast-icon">{icon}</div>
            <div className="toast-content">
              <p className="toast-message">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="toast-close"
              aria-label="Close notification"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
