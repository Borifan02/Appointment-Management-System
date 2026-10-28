# 🏥 MediCare Hub — Enterprise Clinical Appointment Management System

> A production-grade, full-featured appointment scheduling, roster management, and healthcare operations platform built with modern **React 19**, **CSS Design Tokens**, and **Automated Jest Testing**.

[![React 19](https://img.shields.io/badge/React-19.1.0-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Node.js Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green?logo=node.js)](server/README.md)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-47A248?logo=mongodb)](server/README.md)
[![Jest Tests](https://img.shields.io/badge/Tests-16%20Passed-success?logo=jest)](https://jestjs.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Production Build](https://img.shields.io/badge/Production%20Build-Optimized-brightgreen)](#build-for-production)
[![RBAC System](https://img.shields.io/badge/Security-RBAC%20%2B%20JWT-blueviolet)](#role-based-access-control-rbac)

---

## 🌟 Overview & Portfolio Highlights

**MediCare Hub** is an enterprise-grade appointment management platform designed to replace fragile single-page forms with a complete, multi-role clinical workflow system. It demonstrates senior-level full-stack architecture, Role-Based Access Control (RBAC), customized role dashboards, conflict detection algorithms, and seamless integration between a modern React frontend and a robust **Node.js / Express.js + MongoDB** backend.

### 💼 Why This Stands Out in a Developer Portfolio
1. **4 Clear, Dedicated User Dashboards**: Unlike generic apps that show identical screens to every user, MediCare Hub provides tailor-made workspaces:
   - 🛡️ **Clinic Director / Admin Dashboard**: High-level healthcare analytics, gross revenue metrics, provider utilization, clinic-wide schedule, and database administration.
   - 👨‍⚕️ **Doctor Clinical Workspace**: Senior physician dashboard (Dr. Evelyn Reed) with personal consultation queue, status transitions (Confirmed ➔ In-Progress ➔ Completed), and clinical diagnosis notes editor.
   - 📋 **Front Desk Receptionist Concierge**: Daily arrival intake desk, room directory, walk-in booking, and 1-click visit pass printing.
   - 👤 **Patient Client Self-Service Portal**: Hero card for next upcoming visit, instant RFC-5545 `.ics` calendar pass download, printable slip, and personal visit history.
2. **Interactive Persona Switcher & Full Authentication System**: Seamlessly switch between the 4 personas with a 1-click navbar switcher OR sign in with credentials via the secure modal (complete with password strength metering and client registration).
3. **Full-Stack Architecture with Node.js, Express & MongoDB**: Built with a dedicated backend (`server/`) containing Mongoose models (`User`, `Appointment`), JWT authentication, conflict checking middleware, and database seeder.
4. **Double-Booking Prevention Algorithm**: Real-time overlapping interval calculations (`[start1, end1]` vs `[start2, end2]`) preventing physician double-booking based on customized working hours and appointment durations.
5. **Interactive Monthly Calendar & Hourly Timeline**: Custom 35/42-cell calendar grid with status pills, day-level schedule inspection, and 8:00 AM – 6:00 PM hourly slot timelines with click-to-book capabilities.
6. **5-Step Client Self-Service Booking Wizard**: Multi-step booking experience featuring dynamic doctor matching, real-time slot generation, patient intake form, and immediate confirmation with reference code.
7. **iCalendar (.ICS) Standard Protocol**: Generates standard RFC-5545 `.ics` event files on the fly, allowing patients to import appointments directly into **Google Calendar**, **Apple Calendar**, and **Microsoft Outlook**.
8. **Printable Official Visit Slip / Receipt**: Styled printable appointment pass featuring clinic branding, patient details, fee breakdown, consultation room, and simulated SVG barcode.
9. **Master Registry with Multi-Filters & Pagination**: Instant debounce-free search, status dropdowns, specialist filters, date ranges (Today, Upcoming, Past), sorting (Date, Name, Fee, Status), and pagination (5/10/20 per page).
10. **100% Automated Test Coverage**: Unit and integration test suite (16 passed tests) covering calendar utilities, time conversions, overlap algorithms, conflict detection, Auth modal, and RBAC view switching.

---

## 📸 4 Distinct User Dashboards

### 🛡️ 1. Clinic Director / Admin Dashboard
- **Executive KPIs**: Total Bookings, Today's Schedule count, Gross Booked Revenue ($), and Completion Rate (%).
- **Clinic-Wide Schedule**: Live timeline across all physicians with 1-click status updates and patient record inspection.
- **Provider Roster Utilization**: Real-time load breakdown per doctor.
- **Data Tools**: 1-click CSV data export and JSON backup & restore.

### 👨‍⚕️ 2. Doctor / Physician Clinical Workspace
- **Personalized Patient Queue**: Filters exclusively for the active physician (e.g. Dr. Evelyn Reed).
- **Duty Details**: Display assigned consultation room (e.g. Suite 101) and active duty hours.
- **Clinical Diagnosis Notes**: Dedicated note editor with permission locks.
- **Direct Status Progression**: Move patients from Confirmed to In-Progress to Completed as consultations happen.

### 📋 3. Receptionist / Front Desk Concierge
- **Patient Intake Desk**: Check-in arrivals counter, pending intake tracker, and completed consultation counter.
- **Fast Walk-In Registration**: 1-click shortcut to register walk-in patients.
- **1-Click Visit Slip Printer**: Instantly open and print official clinic arrival receipts.
- **Room Directory**: View consultation room assignments for each specialist.

### 👤 4. Patient Client Self-Service Portal
- **Hero Card**: Highlights the patient's next upcoming appointment with countdown and doctor details.
- **Digital Passes**: 1-click download of `.ICS` calendar invite for Google Calendar/Outlook/Apple Calendar.
- **Printable Pass**: Open official patient pass for clinic arrival.
- **Complete History**: Chronological table of all past and upcoming consultations.

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

### Installation & Running the Full Stack

#### Option A: Run Frontend (Standalone with Mock Service Layer)
```bash
# 1. Clone repository
git clone https://github.com/Borifan02/Appointment-Management-System.git
cd Appointment-Management-System

# 2. Install dependencies & start
npm install
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your browser. All features work immediately with local persistence and realistic clinical demo data.

#### Option B: Run Full Stack (React + Node.js/Express + MongoDB)
```bash
# Terminal 1: Start Express.js + MongoDB API Server
cd server
npm install
npm run dev

# Terminal 2: Start React Frontend
cd ..
npm start
```
The React frontend automatically connects to the backend API at `http://localhost:5000/api`. See [server/README.md](server/README.md) for complete API documentation.

### Running Automated Tests

```bash
npm test -- --watchAll=false
```

All 16 automated tests will run and output verification results.

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
