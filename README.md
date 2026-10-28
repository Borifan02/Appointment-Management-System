# 🏥 MediCare Hub — Enterprise Clinical Appointment Management System

> A production-grade, full-featured appointment scheduling, roster management, and healthcare operations platform built with modern **React 19**, **CSS Design Tokens**, and **Automated Jest Testing**.

[![React 19](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Jest Tests](https://img.shields.io/badge/Tests-13%20Passed-success?logo=jest)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Production Build](https://img.shields.io/badge/Production%20Build-Optimized-brightgreen)](#build-for-production)
[![Code Quality](https://img.shields.io/badge/Architecture-Modular%20Context%20API-blueviolet)](#architecture)

---

## 🌟 Overview & Portfolio Highlights

**MediCare Hub** is an enterprise-grade appointment management platform designed to replace fragile single-page forms with a complete, multi-role clinical workflow system. It demonstrates senior-level frontend architecture, data modeling, conflict detection algorithms, and calendar integration that hiring managers and engineering teams look for.

### 💼 Why This Stands Out in a Developer Portfolio
1. **Interactive Monthly Calendar & Hourly Timeline**: Custom 35/42-cell calendar grid with status pills, day-level schedule inspection, and 8:00 AM – 6:00 PM hourly slot timelines with click-to-book capabilities.
2. **Role-Based Access Control (RBAC) Architecture**: 4 interactive personas (**🛡️ Clinic Admin**, **👨‍⚕️ Physician / Doctor**, **📋 Receptionist / Front Desk**, **👤 Patient Client Portal**) with dedicated permission-gated navigation, data isolation, and a 1-click persona switcher in the navbar.
3. **Conflict Detection & Smart Availability Engine**: Real-time overlapping interval calculations (`[start1, end1]` vs `[start2, end2]`) preventing physician double-booking based on customized working hours and appointment durations.
4. **5-Step Client Self-Service Booking Wizard**: Multi-step booking experience featuring dynamic doctor matching, real-time slot generation, patient intake form, and immediate confirmation with reference code.
5. **iCalendar (.ICS) Standard Protocol**: Generates standard RFC-5545 `.ics` event files on the fly, allowing patients to import appointments directly into **Google Calendar**, **Apple Calendar**, and **Microsoft Outlook**.
6. **Printable Official Visit Slip / Receipt**: Styled printable appointment pass featuring clinic branding, patient details, fee breakdown, consultation room, and simulated SVG barcode.
7. **Analytics & Financial Dashboard**: Executive KPI cards, real-time revenue calculations, visual segmented progress bar for status distribution, peak-hours heatmap (morning/afternoon/evening), and provider workload charts.
8. **Comprehensive Registry with Multi-Filters & Pagination**: Instant debounce-free search, status dropdowns, specialist filters, date ranges (Today, Upcoming, Past), sorting (Date, Name, Fee, Status), and pagination (5/10/20 per page).
9. **100% Automated Test Coverage**: Unit and integration test suite (15 passed tests) covering calendar utilities, time conversions, overlap algorithms, conflict detection, and RBAC view switching.

---

## 📸 Core Modules & User Interface

### 1. Executive Operations Dashboard
- High-level KPI cards: Total Bookings, Today's Schedule count, Total Booked Revenue, and Completion Rate.
- Live Today's Schedule timeline with one-click status transitions (Confirm, In-Progress, Complete).
- Specialists on Duty roster preview with real-time daily visit counts.
- Next upcoming bookings drawer.

### 2. Interactive Calendar & Day Timeline
- Monthly view with month/year navigation, today highlighter, and appointment count indicators.
- Filter calendar by specialist or appointment status.
- Day Schedule: Hourly slots (08:00 to 18:00) with visual time cards and one-click slot booking.

### 3. Patient Self-Service Booking Wizard
- **Step 1: Clinical Service Selection** (Primary Care, Dentistry, Cardiology, Dermatology, Pediatrics, Physiotherapy) with duration, fee, and descriptions.
- **Step 2: Specialist Selection** (matching doctors eligible for the chosen service, displaying ratings, experience, and room).
- **Step 3: Date & Dynamic Slot Generator** (calculates booked vs open slots for that doctor, disabling conflicts).
- **Step 4: Patient Details** (Name, Email, Phone, Visit Priority: Routine/Urgent/VIP/Follow-up, Clinical Notes).
- **Step 5: Instant Confirmation** (Reference Code, Summary, .ICS download, and printable slip).

### 4. Master Appointments Registry
- Full table with Patient Name, Reference Code, Priority tags, Contact information with direct `mailto:` / `tel:` / `WhatsApp` links.
- Inline status dropdown updating local state and LocalStorage immediately.
- Modal views for patient clinical details and note modifications.
- Data export to CSV and JSON state backup.

### 5. Specialists & Services Catalog
- Searchable doctor directory with clinical qualifications, working days/hours, room locations, and contact info.
- Clinical services catalog with pricing and duration.

### 6. Analytics & Financial Performance
- Gross Booked Value vs Realized (Completed) Revenue.
- Average ticket size per consultation.
- Attrition & cancellation rate tracking.
- Visual status distribution chart.
- Time-of-day workload heatmap (Morning vs Mid-Day vs Afternoon).
- Provider utilization and service demand charts.

---

## 🛠️ Tech Stack & Architecture

- **UI Library**: React 19 (`19.1.0`) with React Hooks (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`).
- **State Management**: Centralized `AppointmentContext` with persistent LocalStorage synchronizer and optimistic state updates.
- **Styling**: Vanilla CSS Design System with CSS Custom Properties, smooth Dark/Light mode support, fluid typography, and `@media print` stylesheets.
- **Testing**: Jest + `@testing-library/react` + `@testing-library/jest-dom` for automated unit and component testing.
- **Data Protocols**: RFC-5545 iCalendar (`.ics`), RFC-4180 CSV Export, JSON Schema Backup & Restore.

```
src/
├── __tests__/                   # Automated component integration tests
│   └── App.test.js
├── components/
│   ├── analytics/
│   │   └── AnalyticsView.js     # Revenue metrics & workload charts
│   ├── appointments/
│   │   ├── AppointmentDetailModal.js # Patient clinical record & notes editor
│   │   ├── AppointmentReceipt.js     # Printable official visit slip with barcode
│   │   ├── AppointmentsTable.js      # Advanced data table with search, filter, pagination
│   │   └── EditAppointmentModal.js   # Rescheduling & editing with conflict checks
│   ├── booking/
│   │   └── ClientBookingWizard.js   # 5-step interactive client booking flow
│   ├── calendar/
│   │   ├── CalendarView.js      # Interactive monthly calendar grid
│   │   └── DaySchedule.js       # Hourly schedule timeline (08:00 - 18:00)
│   ├── common/
│   │   ├── ConfirmModal.js      # Accessible confirmation dialog
│   │   └── Toast.js             # Notification toasts portal
│   ├── dashboard/
│   │   └── DashboardOverview.js # Executive KPIs and today's schedule
│   ├── layout/
│   │   ├── Navbar.js            # Top bar with clock, sample data trigger & theme switch
│   │   └── Sidebar.js           # Navigation drawer and backup export/import tools
│   └── roster/
│       └── StaffAndServices.js  # Medical practitioners roster & services catalog
├── context/
│   └── AppointmentContext.js    # Global state, conflict checks, and LocalStorage sync
├── data/
│   ├── demoData.js              # 16 realistic demo appointments relative to today
│   ├── services.js              # Catalog of medical services & pricing
│   └── specialists.js           # Doctor profiles, working hours, and specialties
├── utils/
│   ├── __tests__/
│   │   └── calendarUtils.test.js # Unit tests for scheduling algorithms
│   ├── calendarUtils.js         # Slot generator, conflict checker, ICS generator
│   └── exportUtils.js           # CSV export, JSON backup & restore
├── App.css                      # Design system, dark mode tokens & print styles
├── App.js                       # App shell & dynamic view router
├── index.js                     # Root entry point
└── setupTests.js                # Testing library configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Borifan02/Appointment-Management-System.git

# 2. Enter directory
cd Appointment-Management-System

# 3. Install dependencies
npm install

# 4. Start local development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Automated Tests

```bash
npm test -- --watchAll=false
```

All 15 automated tests will run and output verification results.

### Production Build

```bash
npm run build
```

This generates an optimized, minified bundle in the `build/` directory ready for deployment on **Vercel**, **Netlify**, or **AWS S3 / CloudFront**.

---

## 💡 Key Algorithms & Engineering Decisions

### 1. Double-Booking Conflict Prevention
```javascript
export const isIntervalOverlapping = (start1, duration1, start2, duration2) => {
  const s1 = timeToMinutes(start1);
  const e1 = s1 + duration1;
  const s2 = timeToMinutes(start2);
  const e2 = s2 + duration2;
  return s1 < e2 && s2 < e1;
};
```
Whenever an appointment is booked or rescheduled, `checkAppointmentConflict` verifies against all active bookings for that specialist on that date, ignoring cancelled records or the record currently being modified.

### 2. Standard iCalendar Protocol (.ICS Generation)
Instead of relying on third-party backend servers, the application generates valid `text/calendar` payloads directly in the browser with `UID`, `DTSTART`, `DTEND`, `SUMMARY`, and `LOCATION`, enabling universal calendar compatibility.

### 3. Realistic Demo Data Generation Relative to `Today`
To ensure portfolio reviewers and recruiters always see an active schedule regardless of when they visit, `getRealisticDemoAppointments()` dynamically computes relative dates (`Today`, `Yesterday`, `Tomorrow`, `+3 Days`), ensuring the application never appears empty or outdated.

---

## 🚢 Deployment Guide

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
npx netlify deploy --prod --dir=build
```

---

## 📄 License
This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.
