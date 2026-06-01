<div align="center">

# 🎮 GamePulse AI

### Player Analytics & Churn Prediction Platform

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com)

*A production-quality gaming analytics platform built for Software Engineering portfolio interviews*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Development Phases](#-development-phases)
- [Running Tests](#-running-tests)
- [Docker Setup](#-docker-setup)
- [Contributing](#-contributing)

---

## 🌟 Overview

**GamePulse AI** is a full-stack gaming analytics platform that collects real-time player telemetry events, generates engagement dashboards, manages competitive leaderboards, and predicts player churn using machine learning.

Built as a portfolio project targeting Software Engineering roles at gaming companies (EA, Riot, Epic, Unity, etc.), it demonstrates:

- **Real-time telemetry ingestion** at scale
- **Analytics dashboards** with interactive charts
- **Machine learning** churn prediction pipeline
- **Production-grade** API design with auth, rate limiting, and security
- **Microservice architecture** separating Node.js backend from Python ML service
- **Docker** containerization for consistent deployment

---

## ✨ Features

<<<<<<< HEAD
### ✅ Phase 1 – Authentication c
=======
### ✅ Phase 1 – Authentication 
>>>>>>> e5c46e2c885d048aca04b91f1dda1b6cb5261f1d
- JWT-based authentication (register / login / logout)
- Role-based access control (Player / Analyst / Admin)
- Bcrypt password hashing (salt rounds: 12)
- Input validation with detailed error messages
- Rate limiting (20 auth requests / 15 min)
- Security headers via Helmet

### 🔲 Phase 2 – Telemetry Events (Next)
- Ingest single and batch player events
- 28 built-in event types (session, gameplay, economy, social)
- Session tracking with duration and device info
- Paginated event history per player

### 🔲 Phase 3 – Analytics Dashboard
- React + TypeScript frontend with TailwindCSS
- Interactive charts (Recharts): DAU, retention, session duration
- Player engagement heatmaps
- Real-time event feed

### 🔲 Phase 4 – Leaderboards
- Global and per-game leaderboards
- Multiple ranking metrics (score, XP, playtime)
- Player rank history and delta tracking

### 🔲 Phase 5 – Churn Prediction (ML)
- Python / Scikit-Learn churn model
- Feature engineering from telemetry data
- REST prediction API (FastAPI)
- Churn risk scores displayed on dashboard (Low / Medium / High)

### 🔲 Phase 6 – Dockerization & Deployment
- Full Docker Compose production stack
- CI/CD pipeline (GitHub Actions)
- Environment-based configuration

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + TypeScript | UI framework |
| **Styling** | TailwindCSS | Utility-first CSS |
| **Charts** | Recharts | Analytics visualizations |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB Atlas | Primary data store |
| **Auth** | JWT + bcryptjs | Authentication |
| **ML Service** | Python + Scikit-Learn | Churn prediction |
| **ML API** | FastAPI + Uvicorn | ML service endpoint |
| **Validation** | express-validator | Input validation |
| **Security** | Helmet, express-rate-limit | API hardening |
| **Logging** | Winston + Morgan | Structured logging |
| **Testing** | Jest + Supertest | API integration tests |
| **Container** | Docker + Docker Compose | Dev/prod containerization |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│              React + TypeScript + TailwindCSS                │
│                    (Port 3000)                               │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / REST
┌───────────────────────────▼─────────────────────────────────┐
│                       API LAYER                              │
│                  Node.js + Express.js                        │
│                    (Port 5000)                               │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  ┌──────────┐  │
│  │   Auth   │  │  Events  │  │Leaderboard│  │Analytics │  │
│  │  Routes  │  │  Routes  │  │  Routes   │  │  Routes  │  │
│  └──────────┘  └──────────┘  └───────────┘  └──────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Middleware: JWT Auth │ Rate Limit │ Helmet │ CORS   │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────┬────────────────────────────────┬─────────────────┘
           │                                │ HTTP
┌──────────▼──────────┐        ┌───────────▼─────────────────┐
│    DATABASE LAYER   │        │        ML SERVICE            │
│   MongoDB Atlas     │        │   Python + FastAPI           │
│                     │        │   (Port 8000)                │
│  ┌───────────────┐  │        │                              │
│  │     users     │  │        │  ┌────────────────────────┐ │
│  ├───────────────┤  │        │  │  Scikit-Learn Model    │ │
│  │    events     │  │        │  │  Churn Prediction      │ │
│  ├───────────────┤  │        │  └────────────────────────┘ │
│  │   sessions    │  │        └─────────────────────────────┘
│  ├───────────────┤  │
│  │ leaderboards  │  │
│  ├───────────────┤  │
│  │  predictions  │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## 📁 Project Structure

```
gamepulse-ai/
│
├── 📄 README.md                        ← You are here
├── 📄 PROJECT_STATUS.md                ← AI handoff document (always up to date)
├── 📄 docker-compose.yml               ← Full stack Docker orchestration
├── 📄 package.json                     ← Root scripts
├── 📄 .gitignore
│
├── 📂 backend/                         ← Node.js + Express API
│   ├── 📄 Dockerfile
│   ├── 📄 package.json
│   ├── 📄 .env.example                 ← Copy to .env and fill in values
│   ├── 📄 .gitignore
│   │
│   ├── 📂 src/
│   │   ├── 📄 server.js                ← Entry point
│   │   ├── 📄 app.js                   ← Express app config
│   │   │
│   │   ├── 📂 config/
│   │   │   └── 📄 database.js          ← MongoDB Atlas connection
│   │   │
│   │   ├── 📂 models/
│   │   │   ├── 📄 User.js              ← User schema (auth + gaming profile + churn)
│   │   │   └── 📄 Event.js             ← Telemetry event schema (28 event types)
│   │   │
│   │   ├── 📂 controllers/
│   │   │   └── 📄 authController.js    ← register, login, getMe, logout
│   │   │
│   │   ├── 📂 routes/
│   │   │   └── 📄 authRoutes.js        ← /api/auth/* route definitions
│   │   │
│   │   ├── 📂 middleware/
│   │   │   ├── 📄 auth.js              ← JWT protect + RBAC restrictTo
│   │   │   ├── 📄 validators.js        ← express-validator rules
│   │   │   └── 📄 errorHandler.js      ← Global error + 404 handler
│   │   │
│   │   └── 📂 utils/
│   │       ├── 📄 jwt.js               ← Token generation + verification
│   │       ├── 📄 logger.js            ← Winston logger
│   │       └── 📄 response.js          ← Standardized API response helpers
│   │
│   └── 📂 tests/
│       └── 📄 auth.test.js             ← Jest + Supertest auth tests
│
├── 📂 frontend/                        ← React + TypeScript (Phase 3)
│   └── (scaffold coming in Phase 3)
│
├── 📂 ml-service/                      ← Python churn prediction (Phase 5)
│   ├── 📂 src/
│   ├── 📂 data/
│   ├── 📂 models/
│   └── 📂 notebooks/
│
└── 📂 docker/
    └── 📄 mongo-init.js                ← Local MongoDB initialization script
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 20.x LTS | [nodejs.org](https://nodejs.org) |
| npm | 10.x+ | Included with Node |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| MongoDB Atlas account | Free tier | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| Docker Desktop *(optional)* | Latest | [docker.com](https://docker.com) |

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/gamepulse-ai.git
cd gamepulse-ai
```

---

### Step 2 — Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **free cluster** (M0)
3. Under **Database Access** → Add a database user (username + password)
4. Under **Network Access** → Add IP Address → Allow access from anywhere (`0.0.0.0/0`) for development
5. Click **Connect** → **Drivers** → Copy the connection string

It will look like:
```
mongodb+srv://myuser:mypassword@cluster0.abc12.mongodb.net/?retryWrites=true&w=majority
```

---

### Step 3 — Configure environment variables

```bash
cd backend
copy .env.example .env        # Windows
# OR
cp .env.example .env          # Mac/Linux
```

Open `backend/.env` and fill in your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/gamepulse?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

> ⚠️ **Never commit `.env` to Git.** It is already in `.gitignore`.

---

### Step 4 — Install dependencies

```bash
# From inside the backend folder
cd backend
npm install
```

---

### Step 5 — Start the development server

```bash
# Make sure you are inside the backend folder
cd backend
npx nodemon src/server.js
```

You should see:

```
2026-05-31 10:00:00 [info]: MongoDB Atlas connected: cluster0.abc12.mongodb.net
2026-05-31 10:00:00 [info]: 🎮 GamePulse AI API running on port 5000
2026-05-31 10:00:00 [info]:    Environment: development
2026-05-31 10:00:00 [info]:    Health check: http://localhost:5000/health
```

---

### Step 6 — Verify it's working

Open your browser or Postman and hit:

```
GET http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "GamePulse AI API is running",
  "environment": "development",
  "timestamp": "2026-05-31T10:00:00.000Z"
}
```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NODE_ENV` | ✅ | `development` | Environment mode |
| `PORT` | ✅ | `5000` | Server port |
| `MONGODB_URI` | ✅ | — | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | — | Secret key for signing JWTs (min 32 chars in prod) |
| `JWT_EXPIRES_IN` | ✅ | `7d` | JWT token expiry (e.g. `7d`, `24h`, `1h`) |
| `CORS_ORIGIN` | ✅ | `http://localhost:3000` | Allowed frontend origin |
| `RATE_LIMIT_WINDOW_MS` | ❌ | `900000` | Rate limit window in ms (900000 = 15 min) |
| `RATE_LIMIT_MAX` | ❌ | `100` | Max requests per window |

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### Response Format

All responses follow this standard format:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": { },
  "errors": [ ],
  "meta": { }
}
```

---

### 🔓 Public Endpoints

#### `GET /health`
Check if the server is running.

```bash
curl http://localhost:5000/health
```

---

#### `POST /api/auth/register`
Create a new user account.

**Request Body:**
```json
{
  "username": "playerone",
  "email": "player@example.com",
  "password": "SecurePass1",
  "displayName": "Player One"
}
```

**Validation Rules:**
- `username`: 3–30 chars, alphanumeric + underscores only
- `email`: valid email format
- `password`: min 8 chars, must include uppercase + number
- `displayName`: optional, max 50 chars

**Success Response (201):**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "665f1a2b3c4d5e6f7a8b9c0d",
      "username": "playerone",
      "email": "player@example.com",
      "displayName": "Player One",
      "role": "player",
      "gameProfile": {
        "gamesPlayed": 0,
        "totalPlaytimeMinutes": 0,
        "rank": "Bronze",
        "level": 1,
        "xp": 0
      }
    }
  }
}
```

---

#### `POST /api/auth/login`
Authenticate and receive a JWT token.

**Request Body:**
```json
{
  "email": "player@example.com",
  "password": "SecurePass1"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { }
  }
}
```

---

### 🔒 Protected Endpoints

All protected routes require the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

#### `GET /api/auth/me`
Get the currently authenticated user's profile.

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/me
```

---

#### `POST /api/auth/logout`
Logout (client should discard the token).

```bash
curl -X POST -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/auth/logout
```

---

### Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Bad request / invalid ID format |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (insufficient role) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email/username) |
| `422` | Validation failed |
| `429` | Too many requests (rate limited) |
| `500` | Internal server error |

---

## 🗄 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  username: String,           // unique, 3-30 chars
  email: String,              // unique, lowercase
  password: String,           // bcrypt hashed, never returned
  displayName: String,
  avatarUrl: String,
  role: "player" | "analyst" | "admin",
  isActive: Boolean,
  isEmailVerified: Boolean,

  gameProfile: {
    gamesPlayed: Number,
    totalPlaytimeMinutes: Number,
    favoriteGame: String,
    rank: "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Grandmaster",
    level: Number,
    xp: Number
  },

  churnRisk: {
    score: Number,            // 0.0 - 1.0 (ML output)
    label: "low" | "medium" | "high",
    predictedAt: Date
  },

  lastLoginAt: Date,
  loginCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId,           // ref: User
  sessionId: String,          // client-generated UUID
  eventType: String,          // one of 28 types (see below)
  game: String,
  clientTimestamp: Date,
  serverTimestamp: Date,

  properties: Mixed,          // event-specific payload

  location: {
    map: String,
    zone: String,
    x: Number, y: Number, z: Number
  },

  device: {
    platform: "pc" | "console" | "mobile" | "web",
    os: String,
    deviceId: String,
    appVersion: String
  },

  performance: {
    fps: Number,
    latencyMs: Number,
    memoryMb: Number
  },

  sessionDurationSeconds: Number,
  processed: Boolean,
  createdAt: Date
}
```

**Supported Event Types:**

| Category | Event Types |
|----------|------------|
| Session | `session_start`, `session_end` |
| Gameplay | `match_start`, `match_end`, `level_start`, `level_complete`, `level_failed` |
| Player Actions | `kill`, `death`, `assist`, `ability_used`, `item_purchased`, `item_used` |
| Progression | `xp_gained`, `level_up`, `achievement_unlocked`, `rank_change` |
| Economy | `currency_earned`, `currency_spent`, `purchase` |
| Social | `friend_added`, `party_joined`, `chat_message` |
| Engagement | `tutorial_step`, `quest_started`, `quest_completed` |
| System | `error`, `crash`, `custom` |

---

## 🗺 Development Phases

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| **1** | Project Setup & Auth | ✅ Complete | Folder structure, Docker, JWT auth, MongoDB schemas |
| **2** | Telemetry Events | 🔲 Next | Event ingestion API, batch insert, session tracking |
| **3** | Analytics Dashboard | 🔲 Pending | React frontend, charts, DAU/retention metrics |
| **4** | Leaderboards | 🔲 Pending | Global/game leaderboards, rank tracking |
| **5** | Churn Prediction | 🔲 Pending | Python ML model, FastAPI prediction service |
| **6** | Dockerization | 🔲 Pending | Production Docker setup, CI/CD |

See [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for detailed handoff notes between development sessions.

---

## 🧪 Running Tests

```bash
cd backend
npm test
```

Tests use **Jest** and **Supertest**. Current test coverage:

| File | Tests |
|------|-------|
| `tests/auth.test.js` | Register (success, duplicate, invalid), Login (success, wrong password, missing user), GetMe (valid token, no token, invalid token) |

> ⚠️ Tests require a valid `MONGODB_URI` in `.env`. For CI, use a separate test Atlas cluster or MongoDB in-memory server.

---

## 🐳 Docker Setup

### Development (with local MongoDB)

```bash
# From project root
docker-compose up --build
```

This starts:
- `gamepulse-backend` on port `5000`
- `gamepulse-frontend` on port `3000` *(Phase 3)*
- `gamepulse-mongo` on port `27017` *(local MongoDB)*

### Using MongoDB Atlas instead of local Docker Mongo

Comment out the `mongo` service in `docker-compose.yml` and set your Atlas URI in the root `.env`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gamepulse
JWT_SECRET=your_secret_here
```

Then:
```bash
docker-compose up backend
```

---

## 🔧 Useful Commands

```bash
# Start backend (development)
cd backend && npx nodemon src/server.js

# Install backend dependencies
cd backend && npm install

# Run tests
cd backend && npm test

# Check API health
curl http://localhost:5000/health

# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testplayer","email":"test@game.com","password":"Test1234","displayName":"Test Player"}'

# Docker: start everything
docker-compose up --build

# Docker: stop everything
docker-compose down

# Docker: stop and delete volumes (fresh DB)
docker-compose down -v
```

---

## 📊 Why This Project for Gaming Interviews?

| Concept | Implementation |
|---------|---------------|
| High-volume data ingestion | Batch event API, compound MongoDB indexes |
| Player lifecycle modeling | Session tracking, login metadata, churn risk fields |
| ML integration | Separate Python ML microservice, FastAPI endpoint |
| Scalable schema design | Event schema with 28 typed events + flexible `properties` field |
| Security best practices | JWT, bcrypt, rate limiting, Helmet, input validation |
| Production patterns | Winston logging, global error handling, graceful shutdown, Docker |
| API design | RESTful, consistent response format, RBAC |

---

## 📝 License

This project is built for portfolio and educational purposes.

---

<div align="center">

Built with ❤️ for the gaming industry

**GamePulse AI** — *Know your players. Keep them playing.*

</div>
