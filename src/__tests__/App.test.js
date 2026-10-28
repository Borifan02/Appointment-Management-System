// src/__tests__/App.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "../App";

describe("Appointment Management System App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("renders navbar and brand title", () => {
    render(<App />);
    expect(screen.getByText(/MediCare/i)).toBeInTheDocument();
    expect(screen.getByText(/Hub/i)).toBeInTheDocument();
  });

  test("renders executive dashboard view by default", () => {
    render(<App />);
    expect(screen.getByText(/Clinical Operations Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Bookings/i)).toBeInTheDocument();
  });

  test("navigates to Appointments Registry view", () => {
    render(<App />);
    const registryNavBtn = screen.getByRole("button", { name: /Appointments Registry/i });
    fireEvent.click(registryNavBtn);

    expect(screen.getByRole("heading", { name: /Appointments Registry/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search patient, phone, email/i)).toBeInTheDocument();
  });

  test("navigates to Calendar view", () => {
    render(<App />);
    const calendarNavBtn = screen.getByRole("button", { name: /Interactive Calendar/i });
    fireEvent.click(calendarNavBtn);

    expect(screen.getByRole("button", { name: /Month Grid/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Day Timeline/i).length).toBeGreaterThan(0);
  });

  test("navigates to Booking Wizard view", () => {
    render(<App />);
    const bookingNavBtn = screen.getByRole("button", { name: /Book Appointment Wizard/i });
    fireEvent.click(bookingNavBtn);

    expect(screen.getByRole("heading", { name: /Select a Consultation or Service/i })).toBeInTheDocument();
  });

  test("navigates to Analytics & Reports view", () => {
    render(<App />);
    const analyticsNavBtn = screen.getByRole("button", { name: /Analytics & Reports/i });
    fireEvent.click(analyticsNavBtn);

    expect(screen.getByText(/Clinical & Financial Performance Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Booked Value/i)).toBeInTheDocument();
  });

  test("toggles dark mode", () => {
    render(<App />);
    const themeBtn = screen.getByLabelText(/Toggle theme/i);
    expect(themeBtn).toBeInTheDocument();

    fireEvent.click(themeBtn);
    expect(document.body.classList.contains("dark-mode")).toBe(true);

    fireEvent.click(themeBtn);
    expect(document.body.classList.contains("dark-mode")).toBe(false);
  });
});
