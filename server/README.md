# MediCare Hub - Backend API (Node.js + Express + MongoDB)

This is the production-ready REST API backend for **MediCare Hub Clinical Appointment System**, built with **Node.js**, **Express.js**, **MongoDB**, and **Mongoose**.

---

## 🚀 Features

- **Role-Based Access Control (RBAC)**: Supports `admin`, `doctor`, `receptionist`, and `patient`.
- **JWT Authentication**: Secure Bearer tokens with encrypted passwords using `bcryptjs`.
- **Intelligent Overlap & Conflict Detection**: Automated conflict checker prevents double-booking specialists at the database level.
- **Pre-Seeded Clinical Dataset**: Includes 4 instant demo personas and 5+ realistic patient appointments.
- **CORS Enabled**: Configured for `http://localhost:3000` with JSON body parsing and error handling.
- **Graceful Offline Fallback**: If MongoDB is not yet running locally, the server starts safely and informs the developer.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB (Local or MongoDB Atlas)
- **ODM**: Mongoose 8.x
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Configuration**: `dotenv`

---

## 📋 Quick Start Guide

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` (already done by default):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/medicare_hub
JWT_SECRET=medicare_super_secret_jwt_key_2026_portfolio
CLIENT_URL=http://localhost:3000
```
> **Note**: For MongoDB Atlas, replace `MONGODB_URI` with your connection string:  
> `mongodb+srv://<username>:<password>@cluster0.mongodb.net/medicare_hub?retryWrites=true&w=majority`

### 3. Seed Demo Data (Optional)
Populate MongoDB with default medical users and appointments:
```bash
npm run seed
```

### 4. Start the Server
- **Development mode (with auto-reload via nodemon)**:
  ```bash
  npm run dev
  ```
- **Production mode**:
  ```bash
  npm start
  ```

Server will be running at: **`http://localhost:5000`**  
API Health Check: **`http://localhost:5000/api/health`**

---

## 📡 API Endpoints

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`, `phone`, `role`) |
| `POST` | `/api/auth/login` | Public | Login with email & password, returns JWT token |
| `GET` | `/api/auth/me` | Protected | Get profile of logged-in user |
| `GET` | `/api/auth/demo-personas` | Public | List all 4 pre-configured demo accounts |

#### Sample Login Request:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@medicare.com",
  "password": "AdminPassword123!"
}
```

#### Sample Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67215f8a9e01",
    "name": "Dr. Catherine Hayes",
    "email": "admin@medicare.com",
    "role": "admin",
    "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2..."
  }
}
```

---

### 📋 Appointments (`/api/appointments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/appointments` | Public/Auth | Fetch all appointments (supports `?date=`, `?specialistId=`, `?status=`, `?search=`) |
| `GET` | `/api/appointments/:id` | Public/Auth | Get single appointment details |
| `POST` | `/api/appointments` | Public/Auth | Create new appointment (runs automated conflict checks) |
| `PUT` | `/api/appointments/:id` | Public/Auth | Update appointment status, notes, or reschedule |
| `DELETE` | `/api/appointments/:id` | Admin Only | Delete an appointment record |

#### Sample Create Appointment Request:
```json
POST /api/appointments
Content-Type: application/json

{
  "clientName": "Eleanor Vance",
  "email": "eleanor.vance@example.com",
  "phone": "+1 (555) 234-8901",
  "specialistId": "spec-1",
  "specialistName": "Dr. Evelyn Reed",
  "serviceId": "srv-1",
  "serviceName": "General Consultation",
  "date": "2026-10-29",
  "time": "14:30",
  "duration": 30,
  "price": 75,
  "notes": "Routine blood pressure checkup."
}
```

---

## 👥 Built-In Demo Personas

| Role | Name | Email | Password | Allowed Access |
|---|---|---|---|---|
| **Admin** | Dr. Catherine Hayes | `admin@medicare.com` | `AdminPassword123!` | Full operations, revenue KPIs, delete, backup |
| **Doctor** | Dr. Evelyn Reed | `doctor.reed@medicare.com` | `DoctorPassword123!` | Personal schedule, patient queue, clinical diagnosis notes |
| **Receptionist** | Sarah Jenkins | `reception@medicare.com` | `StaffPassword123!` | Patient intake check-in, arrivals queue, pass printing |
| **Patient** | Eleanor Vance | `eleanor.vance@example.com` | `PatientPassword123!` | Self-service booking, upcoming visit pass, visit history |
