// src/services/api.js
/**
 * MediCare Hub REST API Client Layer
 * Full integration layer for Node.js / Express.js + MongoDB backend.
 * Provides seamless fallbacks to LocalStorage when running frontend-only.
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const getAuthToken = () => {
  try {
    return localStorage.getItem("medicare_auth_token") || null;
  } catch (e) {
    return null;
  }
};

const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("medicare_auth_token", token);
    } else {
      localStorage.removeItem("medicare_auth_token");
    }
  } catch (e) {}
};

/**
 * Health check to verify if Node/Express server is active
 */
export const isBackendAvailable = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return res.ok;
  } catch (e) {
    return false; // Backend is offline, front-end continues gracefully
  }
};

/**
 * Authentication Service (Node.js/Express + MongoDB)
 */
export const authService = {
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (e) {
      return { success: false, message: "Backend offline, utilizing local authentication." };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAuthToken(data.token);
      }
      return data;
    } catch (e) {
      return { success: false, message: "Backend offline, registered locally." };
    }
  },

  async getMe() {
    const token = getAuthToken();
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  logout() {
    setAuthToken(null);
  }
};

/**
 * Appointment Service (Node.js/Express + MongoDB)
 */
export const appointmentService = {
  async getAll(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/appointments${query ? `?${query}` : ""}`);
      const data = await res.json();
      return data.success ? data.data : [];
    } catch (e) {
      return null;
    }
  },

  async create(appointmentData) {
    try {
      const token = getAuthToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers,
        body: JSON.stringify(appointmentData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async update(id, updatedData) {
    try {
      const token = getAuthToken();
      const headers = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(updatedData)
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  async delete(id) {
    try {
      const token = getAuthToken();
      const headers = {};
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/appointments/${id}`, {
        method: "DELETE",
        headers
      });
      return await res.json();
    } catch (e) {
      return null;
    }
  }
};
