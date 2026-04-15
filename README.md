# LetMeet

**LetMeet** is a full-stack scheduling application inspired by Calendly, enabling hosts to manage availability and invitees to book meetings seamlessly. Built with modern technologies and designed for scalability.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
  - [Frontend (Vercel)](#frontend-vercel)
  - [Backend (Render)](#backend-render)
- [Implementation Assumptions](#implementation-assumptions)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎯 **Dynamic Dashboard**
- Manage multiple Event Types (Discovery Calls, Tech Interviews, etc.)
- Create and organize multiple Availability Schedules
- Intuitive UI for setting up recurring availability

### 📅 **Advanced Overrides**
- Override weekly hours for specific dates
- Mark specific dates as fully unavailable
- Set custom split-shift time blocks (e.g., 9 AM–12 PM and 2 PM–5 PM)
- **Priority Logic**: Overrides take precedence over weekly schedules

### 🔗 **Intelligent Booking Engine**
- Real-time availability slot calculation
- Double-booking prevention with existing meeting validation
- Timezone-aware scheduling
- Interactive calendar interface for selecting meeting slots

### 📧 **Email Notifications**
- Automatic confirmation emails to invitees
- Host notification on new bookings
- Powered by Nodemailer for reliable delivery

### 🔒 **Security & Reliability**
- Secure password hashing
- JWT-based authentication
- MongoDB data persistence

---

## 🛠 Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | [![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev) [![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev) [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com) |
| **Backend** | [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org) [![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com) [![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com) |
| **Email** | [![Nodemailer](https://img.shields.io/badge/Nodemailer-6-0B0E0F?logo=mail.ru&logoColor=white)](https://nodemailer.com) |
| **Authentication** | [![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens&logoColor=white)](https://jwt.io) |

---

## 📁 Project Structure

```
LetMeet/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service calls
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json          # Deployment configuration
│
├── backend/                  # Node.js + Express application
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Authentication, validation
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Helper functions
│   │   └── app.js           # Express app setup
│   ├── .env.example         # Example environment file
│   ├── package.json
│   └── server.js            # Entry point
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **MongoDB**: Local instance or MongoDB Atlas connection string
- **Email Account**: Gmail or any SMTP provider (for Nodemailer)
- **Git**: Version control

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/vivek724464/LetMeet.git
cd LetMeet
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
# or
yarn install
```

#### 3. Backend Setup

```bash
cd ../backend
npm install
# or
yarn install
```

---

## 🔐 Environment Variables

### Frontend (`.env` or `.env.local`)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
# or for production
VITE_API_URL=https://your-backend-domain.com
```

### Backend (`.env`)

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/letmeet?retryWrites=true&w=majority
# or for local development
MONGODB_URI=mongodb://localhost:27017/letmeet

# Email Configuration (Gmail example)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

#### 📧 Gmail Setup for Email Notifications

1. Enable 2-Step Verification on your Google Account
2. Generate an App Password:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Select "App passwords" (appears after 2FA is enabled)
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
3. Use this password as `EMAIL_PASS` in your `.env`

---

## 💻 Running Locally

### Start Backend

```bash
cd backend
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### Start Frontend

```bash
cd frontend
npm run dev
# or
yarn dev
```

The frontend will run on `http://localhost:5173` (Vite default)

---

## 🌐 Deployment

### Frontend (Vercel)

#### Prerequisites
- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository connected to Vercel

#### Steps

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Create `vercel.json` in the frontend directory**

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

This ensures React Router SPA navigation works correctly on Vercel.

3. **Deploy on Vercel**

- Visit [Vercel Dashboard](https://vercel.com/dashboard)
- Click "New Project"
- Select your GitHub repository
- Set the root directory to `./frontend`
- Add environment variables:
  - `VITE_API_URL`: Your backend API URL
- Click "Deploy"

4. **Set Environment Variables**

In Vercel Project Settings → Environment Variables, add:
- `VITE_API_URL` = `https://your-backend-domain.com`

### Backend (Render)

#### Prerequisites
- Render account ([render.com](https://render.com))
- GitHub repository connected to Render

#### Steps

1. **Create a New Web Service on Render**

- Visit [Render Dashboard](https://dashboard.render.com)
- Click "New" → "Web Service"
- Connect your GitHub repository

2. **Configure the Service**

- **Name**: letmeet-api
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: `./backend`

3. **Add Environment Variables**

In the "Environment" section, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/letmeet
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production
PORT=5000
```

4. **Deploy**

- Click "Create Web Service"
- Render will automatically deploy on every push to `main`

#### Update Frontend API URL

After backend deployment, update frontend environment variable:
- In Vercel: Set `VITE_API_URL` to your Render backend URL (e.g., `https://letmeet-api.onrender.com`)

---

## 📋 Implementation Assumptions

### Priority Logic: **Overrides > Weekly Hours**

The availability system follows this hierarchy:

1. **Highest Priority: Date Overrides**
   - Specific date overrides take absolute precedence
   - A date marked as "unavailable" blocks all time slots
   - Custom split-shifts override any weekly hours

2. **Secondary Priority: Weekly Hours**
   - Recurring weekly schedules apply to all dates
   - Used when no override exists for that date

3. **Booking Validation**
   - All available slots are checked against existing meetings
   - Double-booking is prevented at the database level

**Example Scenario:**
- Weekly Schedule: Monday 9 AM–5 PM
- Override: Next Monday (April 21) set as "Day Off"
- Override: April 22 (Tuesday) with split-shift 9 AM–12 PM, 2 PM–5 PM
- Result:
  - April 21: No slots available (fully overridden)
  - April 22: Only 9–12 PM and 2–5 PM slots are available
  - April 28 (next Monday): 9 AM–5 PM available (no override)

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Events
- `GET /api/events` - Get all event types
- `POST /api/events` - Create event type
- `PUT /api/events/:id` - Update event type
- `DELETE /api/events/:id` - Delete event type

### Availability
- `GET /api/availability` - Get availability schedules
- `POST /api/availability` - Create availability schedule
- `PUT /api/availability/:id` - Update availability schedule
- `POST /api/availability/override` - Add date override

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create booking
- `GET /api/slots` - Get available slots for event
- `PUT /api/bookings/:id` - Update booking status

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

For issues, questions, or suggestions, please open an issue on [GitHub Issues](https://github.com/vivek724464/LetMeet/issues).

---

**Made with ❤️ by Vivek