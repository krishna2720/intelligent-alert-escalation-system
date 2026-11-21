# Intelligent Alert Escalation And Resolution System

## Overview

This project implements a rule-driven alert lifecycle management system that handles creation, escalation, resolution, and automated closure of operational alerts.

The idea is to simulate how real-world fleet monitoring or operations systems behave — where alerts are not just stored, but actively processed based on rules.

It supports scenarios like overspeed events, compliance checks, and negative feedback tracking, with a focus on lifecycle tracking, rule evaluation, and visibility through a dashboard.

---

## Tech Stack

### Backend
- Node.js (ES Modules)
- Express
- MongoDB (Mongoose)
- Redis (used for caching dashboard data)
- node-cron (for scheduled background jobs)

### Frontend
- React
- Chart.js
- Axios

---

## Core Features

### Alert Lifecycle

Each alert moves through a defined lifecycle:

OPEN → ESCALATED → AUTO_CLOSED / RESOLVED

Every transition is stored in a history log so the full lifecycle can be traced.

---

### Rule-Based Escalation

Alerts are escalated when:
- Same driverId + sourceType
- Within a configured time window
- Count crosses threshold

On escalation:
- Status → ESCALATED
- Severity → CRITICAL
- History updated

Rules are defined in a JSON config, so behavior can be adjusted without changing code.

---

### Auto-Close Engine

A background job runs every 5 minutes and checks:

- Compliance-based condition (for example, document_valid = true)
- Expiry window (alert becomes stale after the configured time)

If a condition matches, the alert is moved to AUTO_CLOSED.

---

### Dashboard

The system exposes APIs for:
- Severity summary
- Top drivers
- Trends over time
- Recent auto-closed alerts
- Active rule configuration

The React dashboard includes an alert form. Creating an alert from the UI uses the same alert API and rule engine as API-created alerts, then refreshes the dashboard metrics and trend graph.

---

## Architecture

Routes → Controllers → Services → Models

---

## Caching Strategy

Redis is used for:
- Severity summary
- Top drivers

Cache is invalidated on alert updates.

---

## Failure Handling

- Centralized error handler
- Logging with Winston
- Redis fallback handling

---

## How to Run

Create `.env` in the project root:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
```

Start the backend:

```bash
npm install
npm run dev
```

Start the React frontend in another terminal:

```bash
npm --prefix client install
npm --prefix client start
```

The frontend runs at `http://localhost:3000` and connects to the backend at `http://localhost:5000`.

---

## API Endpoints

Alerts:

```text
POST   /api/v1/alerts
GET    /api/v1/alerts/:alertId
PATCH  /api/v1/alerts/:alertId/resolve
```

Dashboard:

```text
GET /api/v1/dashboard/summary
GET /api/v1/dashboard/top-drivers
GET /api/v1/dashboard/trends
GET /api/v1/dashboard/recent-auto-closed
GET /api/v1/dashboard/rules
```
