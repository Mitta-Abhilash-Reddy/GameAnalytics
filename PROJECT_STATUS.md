# GamePulse AI – PROJECT STATUS

> **Last Updated:** Phase 1 Complete  
> **Maintained by:** Senior Software Architect AI  
> **Next AI:** Read the "Next Immediate Task" and "Handoff Summary" sections before writing any code.

---

## Project Vision

GamePulse AI is a production-quality gaming analytics platform that:
- Collects player telemetry events in real-time
- Generates engagement analytics dashboards
- Manages leaderboards
- Predicts player churn using machine learning (Python / Scikit-Learn)

Target: Portfolio project for Software Engineering interviews, especially gaming companies like EA.

---

## Current Phase

**Phase 1: Project Setup & Authentication**  
Status: ✅ **Complete**  
Completion: 100%

---

## Completed Features

- [x] Full monorepo folder structure (backend / frontend / ml-service / docker)
- [x] Docker setup (docker-compose.yml, Dockerfile for backend, mongo-init.js)
- [x] MongoDB Atlas connection with event listeners and graceful error handling
- [x] Winston logger (console + file: logs/error.log, logs/combined.log)
- [x] User Mongoose schema (full: auth, gaming profile, churn risk fields)
- [x] Event Mongoose schema (full: 28 event types, device info, performance, location)
- [x] JWT utilities (generateAccessToken, verifyToken, extractBearerToken)
- [x] Standardized API response helpers (sendSuccess, sendError, sendValidationError, etc.)
- [x] Auth controller (register, login, getMe, logout)
- [x] Auth middleware (protect, restrictTo)
- [x] Express validators (registerValidators, loginValidators)
- [x] Global error handler (handles CastError, ValidationError, Duplicate Key, JWT errors)
- [x] 404 handler
- [x] Rate limiting (global: 100/15min, auth: 20/15min)
- [x] Helmet security headers
- [x] CORS configured
- [x] Auth tests (supertest: register, login, getMe)

---

## Completed APIs

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user, returns JWT |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Bearer JWT | Get current user profile |
| POST | `/api/auth/logout` | Bearer JWT | Logout (stateless, client discards token) |
| GET | `/health` | Public | Health check |

---

## Database Status

| Collection | Schema | Status |
|------------|--------|--------|
| users | User.js | ✅ Complete |
| events | Event.js | ✅ Schema ready (APIs in Phase 2) |
| sessions | — | 🔲 Phase 2 |
| leaderboards | — | 🔲 Phase 4 |
| predictions | — | 🔲 Phase 5 |

---

## Frontend Status

| Component | Status |
|-----------|--------|
| Vite + React + TypeScript scaffold | 🔲 Phase 3 |
| Dashboard | 🔲 Phase 3 |
| Login / Register UI | 🔲 Phase 3 |
| Leaderboard | 🔲 Phase 4 |
| Analytics Charts | 🔲 Phase 3 |

> Frontend folder exists at `/frontend` but has no code yet. Create it in Phase 3.

---

## ML Status

| Stage | Status |
|-------|--------|
| Dataset generation | 🔲 Not Started |
| Feature engineering | 🔲 Not Started |
| Model training | 🔲 Not Started |
| Prediction API (FastAPI) | 🔲 Not Started |

---

## Folder Structure

```
gamepulse-ai/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB Atlas connection
│   │   ├── controllers/
│   │   │   └── authController.js    # register, login, getMe, logout
│   │   ├── middleware/
│   │   │   ├── auth.js              # protect, restrictTo
│   │   │   ├── errorHandler.js      # globalErrorHandler, notFoundHandler
│   │   │   └── validators.js        # express-validator rules
│   │   ├── models/
│   │   │   ├── User.js              # Full user schema + methods
│   │   │   └── Event.js             # Full event schema + static methods
│   │   ├── routes/
│   │   │   └── authRoutes.js        # /api/auth/*
│   │   ├── utils/
│   │   │   ├── jwt.js               # generateAccessToken, verifyToken
│   │   │   ├── logger.js            # Winston logger
│   │   │   └── response.js          # Standardized response helpers
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Entry point, DB connect, listen
│   ├── tests/
│   │   └── auth.test.js             # Supertest auth tests
│   ├── .env.example
│   ├── .gitignore
│   ├── Dockerfile
│   └── package.json
├── frontend/                        # Empty – scaffold in Phase 3
├── ml-service/                      # Empty – implement in Phase 5
├── docker/
│   └── mongo-init.js                # Local dev MongoDB init
├── docs/                            # Empty – add architecture docs
├── .gitignore
├── docker-compose.yml
└── package.json                     # Root workspace
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/gamepulse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

### Root `.env` (for docker-compose)

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=gamepulse_secret
```

---

## Dependencies Installed

### Backend (npm)

```
express ^4.19.2
mongoose ^8.4.1
jsonwebtoken ^9.0.2
bcryptjs ^2.4.3
cors ^2.8.5
helmet ^7.1.0
express-rate-limit ^7.3.1
express-validator ^7.1.0
morgan ^1.10.0
winston ^3.13.0
dotenv ^16.4.5
--- devDependencies ---
nodemon ^3.1.3
jest ^29.7.0
supertest ^7.0.0
```

### Frontend (Phase 3 – not yet installed)

```
react, react-dom, typescript, vite
tailwindcss, @tailwindcss/vite
recharts
axios
react-router-dom
```

### ML Service (Phase 5 – not yet installed)

```
python 3.11+
scikit-learn, pandas, numpy, fastapi, uvicorn
```

---

## Known Bugs

- None currently. Phase 1 is clean.

---

## Technical Decisions

### Why MongoDB Atlas (not local)?
User explicitly chose Atlas. The `mongoose.connect()` in `database.js` uses the MONGODB_URI env variable — just swap the connection string for any environment.

### Why separate ML service?
Python/Scikit-Learn is the ML standard. Keeping it as a separate microservice allows the Node backend to call it via HTTP (FastAPI), maintaining separation of concerns.

### Why stateless JWT (no refresh tokens yet)?
Phase 1 keeps auth simple. Refresh tokens will be added in Phase 5 when the full user session lifecycle is needed for churn modeling. The schema already has a `refreshToken` field ready.

### Why Event schema has 28 event types?
Pre-defined enum prevents arbitrary strings from polluting the events collection. The `custom` type serves as an escape hatch.

### Why password hashing in pre-save hook?
Centralizes hashing so it always runs regardless of which code path creates/updates a user. Salt rounds = 12 (strong, ~300ms on modern hardware).

### Response format standard
All API responses follow: `{ success: boolean, message: string, data?: object, errors?: array, meta?: object }`. This is enforced via `src/utils/response.js`.

---

## Next Immediate Task

**Phase 2: Telemetry Event Collection**

Build the events ingestion pipeline. Do this in order:

### 1. Create `backend/src/controllers/eventController.js`

Implement these functions:
- `ingestEvent` – POST a single event, validate, save to MongoDB
- `ingestBatch` – POST array of events (max 100), bulk insert
- `getUserEvents` – GET events for authenticated user (paginated)
- `getEventStats` – GET aggregate stats for a user (counts by eventType)

### 2. Create `backend/src/middleware/validators.js` additions

Add `eventValidators`:
- `eventType` must be in the Event schema enum
- `sessionId` required, string
- `game` required, string
- `clientTimestamp` required, ISO date string
- `properties` optional object
- `device.platform` optional enum

### 3. Create `backend/src/routes/eventRoutes.js`

```
POST   /api/events          → protect, eventValidators, ingestEvent
POST   /api/events/batch    → protect, batchValidators, ingestBatch
GET    /api/events          → protect, getUserEvents (query: page, limit, eventType, game)
GET    /api/events/stats    → protect, getEventStats
```

### 4. Register route in `backend/src/app.js`

Uncomment: `app.use('/api/events', eventRoutes);`

### 5. Add Session tracking

Create `backend/src/models/Session.js`:
- `userId`, `sessionId`, `game`, `startTime`, `endTime`, `durationSeconds`
- `eventsCount`, `device`, `platform`
- Update on `session_end` event automatically

### 6. Write tests

Create `backend/tests/events.test.js`:
- Test ingest single event
- Test batch ingest
- Test pagination
- Test without auth (expect 401)

---

## Future Roadmap

| Phase | Name | Status |
|-------|------|--------|
| 1 | Project Setup & Auth | ✅ Complete |
| 2 | Telemetry Event Collection | 🔲 Next |
| 3 | Analytics Dashboard (Frontend) | 🔲 Pending |
| 4 | Leaderboards | 🔲 Pending |
| 5 | Churn Prediction (ML) | 🔲 Pending |
| 6 | Dockerization & Deployment | 🔲 Pending |

---

## Handoff Summary

**What exists:**
The entire backend foundation is built. MongoDB Atlas is connected. Authentication is fully implemented with JWT, bcrypt password hashing, role-based access control, input validation, rate limiting, security headers, and a global error handler. Two Mongoose models exist: `User` (comprehensive: gaming profile, churn risk fields, auth metadata) and `Event` (comprehensive: 28 event types, device info, performance metrics, compound indexes). Standardized response helpers and Winston logging are in place.

**What works:**
- `POST /api/auth/register` → creates user, returns JWT
- `POST /api/auth/login` → verifies credentials, returns JWT  
- `GET /api/auth/me` → returns current user (requires Bearer token)
- `GET /health` → returns server status
- Docker Compose starts the backend + a local MongoDB container

**What remains:**
Phase 2: Build event ingestion APIs (POST /api/events, POST /api/events/batch, GET /api/events, GET /api/events/stats) and Session model. Phase 3: Frontend with React/Vite/Tailwind. Phase 4: Leaderboards. Phase 5: ML churn prediction service.

**Critical implementation details for Phase 2:**
1. The Event schema is already complete in `backend/src/models/Event.js` — do NOT recreate it, just import it.
2. The `protect` middleware in `backend/src/middleware/auth.js` must wrap all event routes.
3. `userId` in events must be set from `req.user._id` (server-side), never trusted from the request body.
4. Batch insert should use `Event.insertMany()` with `{ ordered: false }` to allow partial success.
5. Add the eventRoutes import to `app.js` where the commented placeholder line is.
