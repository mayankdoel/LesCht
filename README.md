# Lescht

Real-time social chat platform built for Gen Z and gaming communities.

Lescht combines Discord-style community structure (servers and channels) with fast direct messaging and live presence updates, using a React frontend and Node.js + Socket.IO backend.

---

## Table of Contents

1. [Overview](#overview)
2. [Current Features](#current-features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Run the App](#run-the-app)
9. [Seed Data (Optional)](#seed-data-optional)
10. [API Reference](#api-reference)
11. [Socket Events](#socket-events)
12. [Scripts](#scripts)
13. [Roadmap](#roadmap)
14. [Troubleshooting](#troubleshooting)
15. [Author](#author)

---

## Overview

**Lescht** is a full-stack real-time chat app with:

- Secure authentication (JWT access + refresh tokens)
- Global chat
- Community-based channels
- 1:1 direct messages
- Presence and typing indicators
- Invite-code based community join flow

The product direction and long-term scope are documented in `prd.md`.

---

## Current Features

### Authentication
- Register with username/email/password
- Login/logout
- Session recovery with `/auth/me`
- Refresh token rotation flow

### Messaging
- Global chat (fallback hub channel)
- Community channel messaging
- Direct messaging between users
- Message history fetch for each context

### Real-Time Experience
- Live message delivery via Socket.IO
- Typing indicators (global, channel, and DM)
- Online/offline presence events
- Auto-joining user sockets to eligible DM/channel rooms

### Communities
- Create community
- Auto-create default `general` channel
- Join community via invite code
- Sidebar navigation between communities/channels/DMs

---

## Tech Stack

### Frontend
- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- Socket.IO Client
- Vite

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Socket.IO
- JWT (`jsonwebtoken`)
- Password hashing (`bcrypt`)
- Security/logging middleware (`helmet`, `cors`, `morgan`)

### Tooling
- npm workspaces (monorepo)
- concurrently
- nodemon

---

## Architecture

```text
[React + Redux SPA]
        |
        |  REST + WebSocket
        v
[Express + Socket.IO Server]
        |
        v
[MongoDB via Mongoose]
```

### Communication model
- **REST API**: auth, users, historical messages, communities, DMs
- **WebSocket (Socket.IO)**: live message delivery, typing events, presence updates

---

## Project Structure

```text
chatapp/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/chat/ # Main chat UI
│   │   ├── pages/Auth/      # Login/Register pages
│   │   ├── redux/           # Store + auth slice
│   │   ├── utils/axios.js   # API client + refresh logic
│   │   └── socket.js        # Socket client setup
│   └── package.json
├── server/                  # Express + Socket.IO backend
│   ├── config/              # DB connection
│   ├── controllers/         # Route handlers
│   ├── middleware/          # JWT middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── socket/              # Socket.IO event handlers
│   ├── seed.js              # Seed script
│   └── package.json
├── prd.md                   # Product requirements and roadmap
└── package.json             # Root workspace config
```

---

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+
- MongoDB instance (local or Atlas)

### Install dependencies

```bash
npm install
```

This installs dependencies for the monorepo and workspaces.

---

## Environment Variables

Create `server/.env`:

```env
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_access_token_secret>
JWT_REFRESH_SECRET=<your_refresh_token_secret>
CLIENT_URL=http://localhost:5173
PORT=5000
# REDIS_URL=redis://localhost:6379
```

Create `client/.env` (optional if using defaults):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Run the App

From the root:

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

Health check:

```http
GET http://localhost:5000/api/health
```

---

## Seed Data (Optional)

To add sample users/community/messages:

```bash
cd server
node seed.js
```

Seed script creates demo users with password:

```text
password123
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout` (protected)
- `GET /auth/me` (protected)

### Users
- `GET /users` (protected) - list users for DM sidebar

### Messages
- `GET /messages` (protected) - global messages
- `GET /messages/channel/:channelId` (protected) - channel messages

### DMs
- `GET /dms` (protected) - user DMs
- `POST /dms/:userId` (protected) - get or create DM
- `GET /dms/:dmId/messages` (protected) - DM messages

### Communities
- `POST /communities` (protected) - create community
- `GET /communities` (protected) - list user communities
- `POST /communities/join` (protected) - join by invite code

---

## Socket Events

### Client emits
- `user:join`
- `message:send`
- `channel:message:send`
- `dm:message:send`
- `channel:join`
- `typing:start` / `typing:stop`
- `channel:typing:start` / `channel:typing:stop`
- `dm:typing:start` / `dm:typing:stop`

### Server emits
- `presence:update`
- `message:receive`
- `channel:message:receive`
- `dm:message:receive`
- `typing:update`
- `channel:typing:update`
- `dm:typing:update`

---

## Scripts

### Root
- `npm run dev` - run both server and client concurrently

### Server (`server/package.json`)
- `npm run dev` - start server with nodemon
- `npm start` - start server with node

### Client (`client/package.json`)
- `npm run dev` - start Vite dev server
- `npm run build` - production build
- `npm run preview` - preview production build
- `npm run lint` - run ESLint

---

## Roadmap

Planned/partially represented in models/PRD:
- Threaded conversations
- Advanced moderation and permissions
- Community roles and richer ACL
- Search improvements
- Optional Redis adapter enablement for horizontal scaling
- OAuth expansion and social login hardening

---

## Troubleshooting

- **401/403 on API calls**
  - Check `Authorization` header and token expiry.
  - Verify `JWT_SECRET` and `JWT_REFRESH_SECRET`.

- **CORS issues**
  - Ensure `CLIENT_URL` in `server/.env` matches frontend origin.

- **Socket not connecting**
  - Confirm token is present in `localStorage`.
  - Verify server is running and frontend points to correct API URL.

- **MongoDB connection error**
  - Validate `MONGODB_URI` and network access to your database.

---

## Author

**Abhishek Anand**

- GitHub: [@Abhishek1232455](https://github.com/Abhishek1232455)
- Email: abhishek1232455@gmail.com

