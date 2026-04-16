# LetMeet

**A modern scheduling and meeting management platform** inspired by Calendly that allows users to create event types, configure availability, and allow others to book meetings easily.

---

## ⚠️ Important: Read Before Getting Started

Before running the project please review:

- **Environment Variables Section** – Required configuration
- **Installation Guide** – Backend and frontend setup
- **API Overview** – Backend endpoints

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Project Architecture](#project-architecture)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Overview](#api-overview)
- [Deployment](#deployement)
- [Future Improvements](#future-improvements)
- [Contributing](#contributing)

  
---

## About

LetMeet is a **full-stack meeting scheduling platform** built to simplify booking and managing meetings.

The system allows users to:

- Create customizable meeting events
- Configure availability schedules
- Share booking links
- Allow others to book meetings
- Manage meetings from a dashboard
- Send automated email notifications

The goal of LetMeet is to eliminate **back-and-forth scheduling communication**.

---

## Features

### Event Management
- Create, edit, and delete meeting event types
- Custom event durations
- Event color configuration
- Buffer time before and after meetings

### Availability Scheduling
- Configure weekly working hours
- Timezone support
- Date-specific availability overrides
- Flexible scheduling system

### Meeting Booking
- Public booking page
- Conflict detection
- Calendar interface
- Attendee information capture

### Meeting Management
- View upcoming meetings
- Cancel meetings
- Reschedule meetings
- Meeting status tracking

### Notifications
- Email confirmation
- Cancellation notifications
- Reschedule notifications

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- Nodemailer
- dotenv
- CORS

### Frontend
- React
- Vite
- React Router
- Tailwind CSS

### Development Tools
- Nodemon
- ESLint
- PostCSS
- Autoprefixer

---

## Quick Start

- Clone Repository

```bash
git clone https://github.com/vivek724464/LetMeet.git
cd LetMeet
```
- Install Backend Dependencies

```bash
cd backend
npm install
```
- Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## Project Architecture
```
Frontend (React + Vite)
        │
        │ REST API
        ▼
Backend (Node.js + Express)
        │
        │ Business Logic
        ▼
MongoDB Database
        │
        ▼
Email Service (Nodemailer)
```

---

## Project Structure
```
LetMeet/
│
├── backend/
│   ├── controllers/
│   │   ├── eventController.js
│   │   ├── meetingController.js
│   │   └── scheduleController.js
│   │
│   ├── models/
│   │   ├── Event.js
│   │   ├── Meeting.js
│   │   └── Schedule.js
│   │
│   ├── routes/
│   │   ├── eventRoutes.js
│   │   ├── meetingRoutes.js
│   │   └── scheduleRoutes.js
│   │
│   ├── utils/
│   │   └── email.js
│   │
│   ├── package-lock.json
│   ├── package.json
│   ├── server.js
│   └── seed.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── EventModal.jsx
│   │   │   ├── OverrideModal.jsx
│   │   │   ├── RescheduleModal.jsx
│   │   ├── pages/
│   │   │   ├── AvailabilityPage.jsx
│   │   │   ├── BookingPage.jsx
│   │   │   ├── ConfirmationPage.jsx
│   │   │   ├── EventTypesPage.jsx
│   │   │   ├── MeetingsPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vercel.json
│   └── vite.config.js
│
└── README.md
```

---

## Environment Variables
Create .env file inside backend
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Create .env file inside frontend
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Running the Application
- Terminal 1: Start Backend
```bash
cd backend
npm run dev
```
- Server runs at:
```
Server runs at:
```
- Terminal 2: Start Frontend
``` bash
cd frontend
npm run dev
```
- Frontend runs at:
```
http://localhost:5173
```

---

## API Overview
- Base URL
```
http://localhost:5000/api
```
- Event Endpoints
```
| Method | Endpoint    | Description    |
| ------ | ----------- | -------------- |
| GET    | /events     | Get all events |
| POST   | /events     | Create event   |
| PUT    | /events/:id | Update event   |
| DELETE | /events/:id | Delete event   |

```
- Meeting Endpoints
```
| Method | Endpoint                 | Description        |
| ------ | ------------------------ | ------------------ |
| GET    | /meetings                | Get meetings       |
| POST   | /meetings                | Book meeting       |
| PUT    | /meetings/:id/cancel     | Cancel meeting     |
| PUT    | /meetings/:id/reschedule | Reschedule meeting |

```
- Schedule & Override Endpoints
```
| Method | Endpoint                         | Description     |
| ------ | -------------------------------- | --------------- |
| GET    | /schedules                       | Get schedules   |
| POST   | /schedules                       | Create schedule |
| PUT    | /schedules/:id                   | Update schedule |
| POST   | /schedules/:scheduleId/overrides | Add override    |
| DELETE | /schedules/:scheduleId/overrides | Delete override |
|        | /:overrideId| Add override       |                 |

```

---

## Deployment

**Frontend (Vercel)**
1. Push your code to GitHub.
2. Import the frontend directory into Vercel.
3. Add VITE_API_URL to Vercel's Environment Variables.
4. Note: A vercel.json file is included in the frontend root to handle React Router rewrite rules and prevent 404 errors on page refresh.

**Backend (Render/Railway)**
1. Connect your GitHub repo to Render/Railway.
2. Set the root directory to backend.
3. Add MONGO_URI, EMAIL_USER, and EMAIL_PASS to the Environment Variables.

---

## Future Improvements
- User authentication
- Multi-user accounts
- Google Calendar integration
- Outlook Calendar sync
- Stripe payment integration
- Zoom / Google Meet links
- Reminder notifications
- Analytics dashboard
- Team scheduling
- Dark mode support

  
---

## Contributing
1. Fork the repository
2. Create a feature branch
```bash
git checkout -b feature/new-feature
```
3. Commit your changes
```bash
git commit -m "Add new feature"
```
4. Push your branch
```bash
git push origin feature/new-feature
```
5. Open a Pull Request

---

### Author
Vivek Kumar

---
Built with ❤️ using React, Node.js, Express, and MongoDB
