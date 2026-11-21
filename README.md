# Intelligent Alert Escalation & Resolution System

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-ESM-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=0b2b3b)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?logo=redis&logoColor=white)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7)
![Vercel](https://img.shields.io/badge/Vercel-Frontend-000000?logo=vercel&logoColor=white)

</div>

> A full-stack, rule-driven operations platform that creates alerts, evaluates escalation thresholds, automates lifecycle closure, and presents operational insights through a real-time React dashboard.

## Live Deployment

| Component | Platform | URL |
| --- | --- | --- |
| Backend API | Render | `https://intelligent-alert-escalation-system-1.onrender.com` |
| Frontend | Vercel | Add the deployed Vercel URL here |

API health check:

```text
GET https://intelligent-alert-escalation-system-1.onrender.com/health
```

## Project Highlights

- Designed a complete alert lifecycle: `OPEN -> ESCALATED -> AUTO_CLOSED` or `OPEN/ESCALATED -> RESOLVED`
- Implemented configurable rule evaluation for overspeed, negative feedback, and compliance alerts
- Added threshold-based escalation with time-window filtering and duplicate-escalation prevention
- Automated alert expiry and compliance-based closure using a scheduled background job
- Built MongoDB aggregation APIs for severity distribution, top drivers, trends, and recent closures
- Added Redis caching for frequently requested dashboard metrics with cache invalidation after mutations
- Preserved every state transition in an append-only alert history
- Separated routing, controllers, services, models, middleware, configuration, and utility responsibilities
- Added centralized error handling, structured Winston logging, Morgan HTTP logs, and CORS support

## Dashboard Capabilities

- Alert severity distribution
- Top drivers with the highest active alert volume
- Daily alert, escalation, auto-close, and resolution trends
- Recently auto-closed alert list with detailed lifecycle history
- Live alert-generation form
- Dynamic rule configuration display

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Axios, Chart.js, React Chart.js 2 |
| Backend | Node.js ES Modules, Express 5 |
| Database | MongoDB, Mongoose |
| Cache | Redis, ioredis |
| Background Processing | node-cron |
| Logging | Winston, Morgan |
| Deployment | Render, Vercel |

## System Architecture

```text
React Dashboard
      |
      | HTTP / JSON
      v
Express REST API
      |
      +--> Controllers
      |       |
      |       v
      +--> Services / Rule Engine
              |
              +--> MongoDB Atlas
              |
              +--> Redis Cache

node-cron
    |
    v
Auto-Close Service --> MongoDB
```

### Request Flow

```text
Client
  -> Express Route
  -> Controller
  -> Service
  -> Mongoose Model
  -> MongoDB
```

The frontend does not contain escalation or auto-close logic. All lifecycle decisions are enforced by backend services.

## Alert Lifecycle

```text
                        threshold reached
OPEN --------------------> ESCALATED
  |                            |
  | expiration/compliance      | expiration/compliance
  v                            v
AUTO_CLOSED <---------------- AUTO_CLOSED

OPEN/ESCALATED -> manual resolution -> RESOLVED
```

Resolved and auto-closed alerts cannot transition back to an active state. Manual resolution of an already resolved or auto-closed alert is rejected.

## Rule Configuration

Rules are centrally managed in `src/config/rules.json`.

| Source Type | Escalation Threshold | Time Window | Auto-Close Window | Compliance Condition |
| --- | ---: | ---: | ---: | --- |
| `overspeed` | 3 alerts | 60 minutes | 1440 minutes | Not configured |
| `feedback_negative` | 2 alerts | 1440 minutes | 2880 minutes | Not configured |
| `compliance` | Not configured | Not configured | 1440 minutes | `metadata.document_valid === true` |

### Escalation Logic

1. Load the rule for the alert's `sourceType`.
2. Calculate the configured time-window start.
3. Count matching alerts with the same `driverId` and `sourceType`.
4. Check whether the driver/source pair is already escalated.
5. Escalate only once, set severity to `CRITICAL`, and append lifecycle history.

### Auto-Close Logic

Every five minutes, the background job:

1. Retrieves alerts in `OPEN` or `ESCALATED` state.
2. Checks compliance metadata when configured.
3. Checks the configured expiry duration.
4. Updates matching alerts to `AUTO_CLOSED`.
5. Appends the closure reason to lifecycle history.

## REST API

### Health

```http
GET /health
```

### Alerts

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/v1/alerts` | Create and evaluate an alert |
| `GET` | `/api/v1/alerts/:alertId` | Retrieve alert details and history |
| `PATCH` | `/api/v1/alerts/:alertId/resolve` | Resolve an active alert |

### Dashboard

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/v1/dashboard/summary` | Severity summary |
| `GET` | `/api/v1/dashboard/top-drivers` | Highest-volume active drivers |
| `GET` | `/api/v1/dashboard/trends` | Alert lifecycle trends |
| `GET` | `/api/v1/dashboard/recent-auto-closed` | Recently auto-closed alerts |
| `GET` | `/api/v1/dashboard/rules` | Active rule configuration |

## Example Requests

Create an overspeed alert:

```bash
curl -X POST "http://localhost:5000/api/v1/alerts" \
  -H "Content-Type: application/json" \
  -d '{
    "sourceType": "overspeed",
    "severity": "WARNING",
    "driverId": "D105",
    "metadata": {
      "speed": 110,
      "speedLimit": 80
    }
  }'
```

Retrieve an alert:

```bash
curl "http://localhost:5000/api/v1/alerts/<alertId>"
```

Resolve an alert:

```bash
curl -X PATCH "http://localhost:5000/api/v1/alerts/<alertId>/resolve"
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- Optional Redis instance

### 1. Clone and install

```bash
git clone https://github.com/krishna2720/intelligent-alert-escalation-system.git
cd intelligent-alert-escalation-system
npm install
npm --prefix client install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

# Optional Redis cache
REDIS_HOST=<redis-host>
REDIS_PORT=<redis-port>
REDIS_PASSWORD=<redis-password>
```

For a separate frontend API configuration, create `client/.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
```

If the frontend and backend use the same local setup, the frontend falls back to `http://localhost:5000/api/v1`.

### 3. Start backend

```bash
npm run dev
```

The backend starts at `http://localhost:5000`.

### 4. Start frontend

```bash
npm --prefix client start
```

The dashboard starts at `http://localhost:3000`.

### 5. Verify services

```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/v1/dashboard/summary
curl http://localhost:5000/api/v1/dashboard/rules
```

## Render Deployment

Create a **Web Service** in Render and connect this GitHub repository.

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Health Check Path | `/health` |

Configure these environment variables in Render:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGO_URI` | Yes | MongoDB Atlas connection string |
| `PORT` | Yes | Use the port supplied by Render or `10000` |
| `REDIS_HOST` | No | Redis host |
| `REDIS_PORT` | No | Redis port |
| `REDIS_PASSWORD` | No | Redis password |

Allow network access to MongoDB Atlas from the deployed backend.

## Vercel Deployment

Import the repository into Vercel and configure the React application directory:

| Setting | Value |
| --- | --- |
| Root Directory | `client` |
| Framework Preset | Create React App |
| Build Command | `npm run build` |
| Output Directory | `build` |

Add this Vercel environment variable:

```env
REACT_APP_API_URL=https://intelligent-alert-escalation-system-1.onrender.com/api/v1
```

Apply the variable to Production, Preview, and Development environments, then redeploy.

## Redis Cache Strategy

- Severity summary cache key: `dashboard:summary`
- Top-drivers cache key: `dashboard:topDrivers`
- Cache TTL: five seconds
- Cache entries are invalidated after alert creation and manual resolution
- Dashboard reads continue through MongoDB if Redis is unavailable
- Cache failures are isolated from core alert operations

## Database Performance

The Mongoose `Alert` model includes compound and standalone indexes for frequent queries:

- `driverId + sourceType + createdAt`
- `sourceType`
- `severity`
- `status`
- `driverId`

MongoDB aggregations group dashboard metrics without loading all documents into application memory.

## Error Handling

- Centralized Express error middleware
- Consistent API response format
- HTTP 400 validation errors
- HTTP 404 missing-alert errors
- HTTP 400 invalid lifecycle-transition errors
- Redis errors do not crash dashboard requests

## Testing Checklist

Before release, verify:

- [ ] Backend health endpoint returns HTTP 200
- [ ] Alert creation validates required fields
- [ ] Overspeed threshold escalates after three matching alerts
- [ ] Negative-feedback threshold escalates after two matching alerts
- [ ] Compliance alerts auto-close when `document_valid` is `true`
- [ ] Expired alerts move to `AUTO_CLOSED`
- [ ] Resolved and auto-closed alerts reject invalid manual transitions
- [ ] Dashboard summary, trends, rules, and top-driver APIs return data
- [ ] Redis cache invalidation occurs after mutations
- [ ] Frontend API URL points to the deployed backend

## Security and Configuration

- Never commit `.env` or database credentials to source control
- Keep `.env` excluded through `.gitignore`
- Rotate exposed database, Redis, and JWT credentials immediately
- Use MongoDB network restrictions or a private network where available
- Restrict Redis access to authorized network addresses
- Prefer environment-specific secrets managed by Render or Vercel

## Key Technical Trade-offs

| Decision | Benefit | Trade-off |
| --- | --- | --- |
| JSON-based rules | Fast updates and straightforward configuration | Requires deployment/restart to change in code |
| `node-cron` | Simple local and scheduled background processing | Free server hosting may sleep and delay execution |
| Redis caching | Faster dashboard reads | Short-lived cache consistency and additional infrastructure dependency |
| MongoDB aggregation | Efficient server-side grouping | Aggregation pipelines require query and index planning |
| REST architecture | Easy integration and debugging | Not suitable for high-frequency real-time event streaming |

## Future Enhancements

- Add automated unit and integration tests
- Introduce Docker-based local environments
- Add authentication and role-based access control
- Move rules into MongoDB for runtime administration
- Add WebSocket or Server-Sent Events for live dashboard updates
- Introduce an outbox or event-driven architecture
- Add pagination and advanced filtering
- Add centralized metrics and distributed tracing
- Implement API rate limiting

## Author

**Krishna Agarwal**

- GitHub: [@krishna2720](https://github.com/krishna2720)
- Repository: [intelligent-alert-escalation-system](https://github.com/krishna2720/intelligent-alert-escalation-system)
