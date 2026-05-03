# 🎓 CareerCampus — Full Stack Career Guidance Platform

> A production-ready, modern web application that helps students explore, choose, and plan their careers with AI-powered recommendations.

![CareerCampus](https://img.shields.io/badge/CareerCampus-v1.0.0-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47A248?style=flat-square&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Quick Start (5 Minutes)](#-quick-start-5-minutes)
6. [Detailed Setup Guide](#-detailed-setup-guide)
7. [Environment Variables](#-environment-variables)
8. [Database Seeding](#-database-seeding)
9. [API Reference](#-api-reference)
10. [Frontend Pages](#-frontend-pages)
11. [Authentication & Roles](#-authentication--roles)
12. [Deployment Guide](#-deployment-guide)
13. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### 🏠 Landing Page
- Animated hero section with gradient design
- Statistics, career highlights, feature grid
- Testimonials, How It Works, CTA banners
- Fully responsive + dark/light mode

### 👤 User Authentication
- JWT-based signup/login
- Password hashing with bcryptjs
- Protected routes (student + admin roles)
- Profile management with interests/stream/qualification

### 🎯 Career Guidance Module
- 4-step interactive form wizard
- Qualification → Stream → Interests → Goals
- Rule-based recommendation engine
- Personalized career matches with percentage score

### 💼 Career Recommendations
- Top 10 career matches with match score %
- Reasons why each career fits
- Job opportunities tab
- Certifications to pursue
- Higher studies options
- Step-by-step career roadmap

### 📊 Career Explorer
- 100+ career paths (seeded)
- Search, filter by category, sort
- Pagination
- Detailed career pages with salary, skills, job roles, companies

### 💬 Query System
- Contact form (no login required)
- Student query history dashboard
- Admin reply system with thread view
- Status tracking (open → in-progress → resolved)

### 🛠️ Admin Panel
- Dashboard with charts (Recharts)
- View all students
- Manage all careers (view/delete)
- Reply to student queries
- Update query statuses

---

## 🔧 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| State | Context API + useReducer |
| HTTP Client | Axios |
| Charts | Recharts |
| Notifications | React Hot Toast |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Security | Helmet, cors, rate-limit |

---

## 📂 Project Structure

```
CareerCampus/
├── package.json                 # Root scripts
├── README.md
│
├── server/                      # Node.js Backend
│   ├── server.js                # Entry point
│   ├── package.json
│   ├── .env.example
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Career.js            # Career schema
│   │   ├── Query.js             # Query/Contact schema
│   │   └── Recommendation.js   # Recommendation schema
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── careerController.js  # Career CRUD
│   │   ├── queryController.js   # Queries logic
│   │   └── recommendationController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── careerRoutes.js
│   │   ├── queryRoutes.js
│   │   └── recommendationRoutes.js
│   ├── middleware/
│   │   └── auth.js              # JWT protect + adminOnly
│   ├── utils/
│   │   └── recommendationEngine.js  # Rule-based AI engine
│   └── data/
│       └── seedData.js          # 12 careers + admin user
│
└── client/                      # React Frontend
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── src/
        ├── main.jsx             # Entry point
        ├── App.jsx              # Router setup
        ├── index.css            # Global styles + Tailwind
        ├── context/
        │   ├── AuthContext.jsx  # Global auth state
        │   └── ThemeContext.jsx # Dark/light mode
        ├── utils/
        │   ├── api.js           # Axios instance
        │   └── helpers.js       # Utilities + constants
        ├── components/
        │   ├── common/
        │   │   ├── Navbar.jsx
        │   │   ├── Footer.jsx
        │   │   └── LoadingSpinner.jsx
        │   └── career/
        │       └── CareerCard.jsx
        └── pages/
            ├── LandingPage.jsx
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── DashboardPage.jsx
            ├── CareersPage.jsx
            ├── CareerDetailPage.jsx
            ├── GuidancePage.jsx
            ├── RecommendationsPage.jsx
            ├── ContactPage.jsx
            ├── ProfilePage.jsx
            ├── SavedCareersPage.jsx
            ├── AdminPage.jsx
            └── NotFoundPage.jsx
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | v18+ | https://nodejs.org |
| **npm** | v9+ | Included with Node.js |
| **MongoDB** | v6+ (local) OR Atlas (cloud) | https://mongodb.com |
| **Git** | Any | https://git-scm.com |

Verify installations:
```bash
node --version    # v18.x.x
npm --version     # 9.x.x
mongod --version  # v6.x.x
```

---

## ⚡ Quick Start (5 Minutes)

```bash
# 1. Extract the ZIP and enter the project
cd CareerCampus

# 2. Install all dependencies
cd server && npm install
cd ../client && npm install
cd ..

# 3. Setup environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Start MongoDB (if local)
mongod

# 5. Seed the database (in a new terminal)
cd server && npm run seed

# 6. Start the backend (new terminal)
cd server && npm run dev

# 7. Start the frontend (new terminal)
cd client && npm run dev

# 8. Open browser
# Frontend: http://localhost:5173
# Backend:  http://localhost:5000/api/health
```

**Admin Login:** `admin@careercampus.com` / `Admin@123`

---

## 📖 Detailed Setup Guide

### Step 1: Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### Step 2: Configure Environment Variables

**Server** — copy and edit `server/.env`:
```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careercampus
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Client** — copy and edit `client/.env`:
```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### Step 3: Start MongoDB

**Option A — Local MongoDB:**
```bash
# Start MongoDB service
mongod

# Or on macOS with Homebrew:
brew services start mongodb-community

# Or on Linux:
sudo systemctl start mongod
```

**Option B — MongoDB Atlas (Cloud):**
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careercampus
```

### Step 4: Seed the Database

```bash
cd server
npm run seed
```

This creates:
- ✅ 12 comprehensive career entries
- ✅ 1 admin user: `admin@careercampus.com` / `Admin@123`

### Step 5: Start Development Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ Server running on http://localhost:5000
# ✅ MongoDB Connected
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ✅ Vite dev server running on http://localhost:5173
```

### Step 6: Access the Application

| URL | Description |
|---|---|
| http://localhost:5173 | Frontend (React App) |
| http://localhost:5000/api/health | Backend health check |
| http://localhost:5173/admin | Admin panel (admin login required) |

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `PORT` | No | Server port | 5000 |
| `MONGODB_URI` | Yes | MongoDB connection string | localhost/careercampus |
| `JWT_SECRET` | Yes | JWT signing secret (min 32 chars) | — |
| `JWT_EXPIRE` | No | Token expiry | 7d |
| `NODE_ENV` | No | Environment | development |
| `CLIENT_URL` | No | Frontend URL for CORS | http://localhost:5173 |

### Client (`client/.env`)

| Variable | Required | Description | Default |
|---|---|---|---|
| `VITE_API_URL` | No | Backend API base URL | /api (via Vite proxy) |

---

## 🌱 Database Seeding

The seed script populates:

### 12 Career Paths
1. Software Engineer (Technology)
2. Data Scientist (Technology)
3. Doctor MBBS/MD (Medical)
4. Chartered Accountant (Finance)
5. Civil Engineer (Engineering)
6. Digital Marketing Specialist (Business)
7. Graphic Designer (Design)
8. Lawyer / Advocate (Law)
9. Teacher / Professor (Education)
10. Civil Services Officer IAS/IPS (Government)
11. UX/UI Designer (Design)
12. Mechanical Engineer (Engineering)

### Admin User
- Email: `admin@careercampus.com`
- Password: `Admin@123`
- Role: admin

**Re-seed anytime:**
```bash
cd server && npm run seed
```
⚠️ This deletes existing careers and admin user first!

---

## 📡 API Reference

### Base URL: `http://localhost:5000/api`

### Auth Routes `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register new student |
| POST | `/login` | None | Login user |
| GET | `/me` | 🔐 JWT | Get current user profile |
| PUT | `/profile` | 🔐 JWT | Update user profile |
| POST | `/save-career/:id` | 🔐 JWT | Toggle save/unsave career |
| GET | `/users` | 🔐 Admin | Get all students |

**Register body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Career Routes `/api/careers`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/` | None | Get all careers (with filters) |
| GET | `/stats` | 🔐 Admin | Get career statistics |
| GET | `/:id` | None | Get single career |
| POST | `/` | 🔐 Admin | Create new career |
| PUT | `/:id` | 🔐 Admin | Update career |
| DELETE | `/:id` | 🔐 Admin | Soft-delete career |

**Query params for GET /careers:**
```
?page=1&limit=12&sort=popular&category=technology&search=developer&demandLevel=very-high
```

### Recommendation Routes `/api/recommendations`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Optional | Generate recommendations |
| GET | `/history` | 🔐 JWT | Get user's rec history |
| GET | `/all` | 🔐 Admin | Get all recommendations |

**POST body:**
```json
{
  "qualification": "graduation",
  "stream": "science",
  "interests": ["technology", "design"],
  "skills": ["Python", "JavaScript"],
  "goals": "I want to work in a tech startup"
}
```

### Query Routes `/api/queries`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/` | Optional | Submit new query |
| GET | `/mine` | 🔐 JWT | Get my queries |
| GET | `/` | 🔐 Admin | Get all queries |
| POST | `/:id/reply` | 🔐 Admin | Reply to query |
| PUT | `/:id/status` | 🔐 Admin | Update query status |
| GET | `/stats` | 🔐 Admin | Query stats |

---

## 📱 Frontend Pages

| Route | Page | Auth Required |
|---|---|---|
| `/` | Landing Page | No |
| `/login` | Login | No (redirects if logged in) |
| `/register` | Register | No (redirects if logged in) |
| `/careers` | Career Explorer | No |
| `/careers/:id` | Career Detail | No |
| `/guidance` | Career Guidance Form | No |
| `/recommendations` | Recommendations (after form) | No |
| `/contact` | Contact / Query Form | No |
| `/dashboard` | Student Dashboard | ✅ Login |
| `/profile` | User Profile | ✅ Login |
| `/saved` | Saved Careers | ✅ Login |
| `/admin` | Admin Panel | ✅ Admin only |

---

## 🔒 Authentication & Roles

### How JWT Works

1. User logs in → server returns JWT token
2. Token stored in `localStorage` as `cc_token`
3. Axios interceptor auto-attaches `Authorization: Bearer <token>` to all requests
4. On 401, user is auto-redirected to `/login`

### Roles

| Role | Access |
|---|---|
| `student` (default) | All public pages + dashboard + profile + saved careers |
| `admin` | Everything above + admin panel + manage careers/queries/users |

### Creating an Admin User

**Option 1 — Run seed script (creates default admin):**
```bash
cd server && npm run seed
# admin@careercampus.com / Admin@123
```

**Option 2 — Manual in MongoDB:**
```js
// In mongosh:
use careercampus
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

---

## 🚀 Deployment Guide

### Option A: Deploy to Render (Free)

**Backend:**
1. Push to GitHub
2. Go to https://render.com → New Web Service
3. Connect repo, set root to `/server`
4. Build: `npm install`, Start: `node server.js`
5. Add environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `JWT_SECRET` = a long random string
   - `CLIENT_URL` = your frontend URL
   - `NODE_ENV` = production

**Frontend:**
1. New Static Site on Render
2. Root: `/client`
3. Build: `npm install && npm run build`
4. Publish dir: `dist`
5. Add env var: `VITE_API_URL` = your backend URL + `/api`

### Option B: Deploy to Vercel (Frontend) + Railway (Backend)

**Frontend → Vercel:**
```bash
cd client
npm run build
# Deploy /client folder to Vercel
# Set VITE_API_URL env variable
```

**Backend → Railway:**
1. Connect GitHub repo
2. Set root to `/server`
3. Add MongoDB Atlas URI and JWT_SECRET
4. Railway auto-detects Node.js

### Option C: Docker

```dockerfile
# Add to project root
# Dockerfile.server
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server .
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "server.js"]
```

```bash
docker build -f Dockerfile.server -t careercampus-server .
docker run -p 5000:5000 --env-file server/.env careercampus-server
```

---

## 🩺 Troubleshooting

### ❌ MongoDB connection failed
```bash
# Check if MongoDB is running
sudo systemctl status mongod    # Linux
brew services list               # macOS

# Start it
sudo systemctl start mongod      # Linux
brew services start mongodb-community  # macOS
```

### ❌ JWT_SECRET error
Make sure your `server/.env` has:
```env
JWT_SECRET=any_long_random_string_at_least_32_characters
```

### ❌ CORS error in browser
Check that `CLIENT_URL` in `server/.env` matches your frontend URL exactly:
```env
CLIENT_URL=http://localhost:5173
```

### ❌ Vite proxy not working
Make sure `vite.config.js` has the proxy correctly set up:
```js
server: {
  proxy: {
    '/api': { target: 'http://localhost:5000' }
  }
}
```
And your `client/.env` should be:
```env
VITE_API_URL=/api
```

### ❌ `npm run seed` fails
Make sure server is NOT running when you seed. Stop any running server first.
Also ensure MongoDB is running.

### ❌ Cannot login as admin
Run the seed script: `cd server && npm run seed`
Then login with: `admin@careercampus.com` / `Admin@123`

### ❌ Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

---

## 🎨 Customization

### Change Color Theme
Edit `client/tailwind.config.js` → change `brand` and `accent` color values.

### Add New Careers
Edit `server/data/seedData.js` and add entries, then re-run seed.

### Modify Recommendation Logic
Edit `server/utils/recommendationEngine.js` — adjust `streamCareerMap`, `interestCareerMap`, and scoring weights.

### Change JWT Expiry
In `server/.env`: `JWT_EXPIRE=30d` (30 days), `JWT_EXPIRE=1h` (1 hour), etc.

---

## 👥 Default Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@careercampus.com | Admin@123 |

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

## 🤝 Built With

- **React** — UI framework
- **Tailwind CSS** — Utility-first styling
- **Express.js** — Backend framework
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB ODM
- **JWT** — Authentication
- **Recharts** — Dashboard charts
- **Lucide React** — Icons
- **React Hot Toast** — Notifications

---

**CareerCampus** — Empowering students to find their perfect career path. 🎓
