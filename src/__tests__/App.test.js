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
    expect(screen.getByText(/Clinic Management & Performance Overview/i)).toBeInTheDocument();
    expect(screen.getByText(/Clinic Bookings/i)).toBeInTheDocument();
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

  test("navigates to Analytics & Reports view in Admin mode", () => {
    render(<App />);
    const analyticsNavBtn = screen.getByRole("button", { name: /Analytics & Reports/i });
    fireEvent.click(analyticsNavBtn);

    expect(screen.getByText(/Clinical & Financial Performance Analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/Gross Booked Value/i)).toBeInTheDocument();
  });

  test("switches role to Doctor and updates clinical schedule", () => {
    render(<App />);
    const roleSwitcherBtn = screen.getByLabelText(/Switch Role/i);
    fireEvent.click(roleSwitcherBtn);

    // Target the Doctor role option by its role description
    const doctorOption = screen.getByText(/Physician portal: access to personal calendar/i);
    fireEvent.click(doctorOption);

    // Verify view updates to Physician schedule
    expect(screen.getByText(/PHYSICIAN CLINICAL WORKSPACE/i)).toBeInTheDocument();
    expect(screen.getByText(/Restricted to Dr. Evelyn Reed's schedule/i)).toBeInTheDocument();
  });

  test("switches role to Patient and navigates to Patient Portal", () => {
    render(<App />);
    const roleSwitcherBtn = screen.getByLabelText(/Switch Role/i);
    fireEvent.click(roleSwitcherBtn);

    // Target Patient role option by its description
    const patientOption = screen.getByText(/Patient client portal: self-service consultation booking/i);
    fireEvent.click(patientOption);

    // Verify patient portal view renders
    expect(screen.getByText(/Welcome back, Eleanor Vance!/i)).toBeInTheDocument();
    expect(screen.getByText(/Your Complete Visit History/i)).toBeInTheDocument();
  });

  test("opens AuthModal and allows switching between Sign In and Register tabs", () => {
    render(<App />);
    const signInBtns = screen.getAllByRole("button", { name: /Sign In/i });
    fireEvent.click(signInBtns[0]);

    expect(screen.getByText(/MediCare Hub Authentication/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign In \(Login\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Account/i)).toBeInTheDocument();

    // Switch to Register tab
    const registerTabBtn = screen.getByRole("button", { name: /Create New Account/i });
    fireEvent.click(registerTabBtn);
    expect(screen.getByText(/Patient Portal Self-Registration/i)).toBeInTheDocument();
    expect(screen.getByText(/Patient Account \(Public\)/i)).toBeInTheDocument();
  });

  test("allows Admin to open staff provisioning modal", () => {
    render(<App />);
    const provisionBtn = screen.getByRole("button", { name: /Provision Staff/i });
    fireEvent.click(provisionBtn);

    expect(screen.getByText(/Provision New Healthcare Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/Medical Doctor \/ Specialist/i)).toBeInTheDocument();
    expect(screen.getByText(/Front Desk Receptionist/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e\.g\. Dr\. Julian Croft/i)).toBeInTheDocument();
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
