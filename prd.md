# 📄 Product Requirements Document (PRD)
## Lescht — Real-Time Social Chat Platform for Gen Z & Gamers

---

**Document Version:** 2.0  
**Last Updated:** April 19, 2026  
**Status:** Draft  
**Owner:** Abhishek Anand  
**Developer:** Abhishek Anand (Full Stack — React.js, Node.js, Express.js, MongoDB)

---

## 🧑‍💻 Developer Profile

**Developer:** Abhishek Anand  
**GitHub:** github.com/Abhishek1232455  
**Contact:** abhishek1232455@gmail.com

### Skill-to-Stack Mapping

| Category | Abhishek's Skills | Used In Lescht |
|---|---|---|
| **Frontend** | React.js, Redux, HTML5, CSS3, Tailwind CSS, Bootstrap | React.js + Redux + Tailwind CSS |
| **Backend** | Node.js, Express.js, REST APIs, JWT | Express.js API + JWT Auth |
| **Database** | MongoDB, MySQL | MongoDB Atlas + Mongoose |
| **Auth** | JWT, Google OAuth | Access/Refresh JWT + Google OAuth |
| **Tools** | Git, GitHub Actions, Docker, Kubernetes, Postman | Docker Compose (local) + GitHub Actions CI/CD |
| **Concepts** | OOP, DSA, DBMS, OS, Computer Networks | Applied throughout architecture |
| **New (small)** | Socket.io | Real-time engine — minimal API surface |
| **New (small)** | Redis (ioredis) | Presence + rate-limiting + message cache |

### Reference Projects
- **1Clik HR Management** — Full-stack (React + Node + MongoDB + JWT + Google OAuth + RBAC + Vercel/Render deploy) → *Direct template for Lescht auth, roles, and deploy pipeline*
- **MagicURL** — URL shortener (Node + MongoDB + short-code generation) → *Direct template for Lescht invite code system*

---

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Audience & User Personas](#4-target-audience--user-personas)
5. [Competitive Landscape](#5-competitive-landscape)
6. [Product Overview & Architecture](#6-product-overview--architecture)
7. [Feature Requirements](#7-feature-requirements)
   - 7.1 Authentication & Onboarding
   - 7.2 Direct Messages (DMs)
   - 7.3 Group Rooms
   - 7.4 Channels & Topics
   - 7.5 Threads
   - 7.6 Real-Time Engine (Socket.io)
   - 7.7 Notifications
   - 7.8 User Profiles & Presence
   - 7.9 Moderation & Safety
   - 7.10 Search
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Technical Architecture](#9-technical-architecture)
10. [Data Models](#10-data-models)
11. [API Specification (REST + WebSocket)](#11-api-specification-rest--websocket)
12. [UI/UX Requirements](#12-uiux-requirements)
13. [Security Requirements](#13-security-requirements)
14. [Milestones & Phased Roadmap](#14-milestones--phased-roadmap)
15. [Risks & Mitigations](#15-risks--mitigations)
16. [Open Questions](#16-open-questions)
17. [Glossary](#17-glossary)

---

## 1. Executive Summary

**Lescht** is a real-time social chat platform purpose-built for Gen Z and the gaming community. It combines the best of Discord-style community infrastructure (channels, topics, threads) with the intimacy of modern direct messaging and group rooms — all powered by a low-latency Socket.io real-time engine.

Lescht's core differentiator is its **raw, expressive, community-first design** that feels native to how younger users already communicate online: fast, visual, casual, and deeply social.

The MVP focuses on four pillars:
- **DMs** — fast 1:1 and small group private messaging
- **Group Rooms** — ephemeral or persistent multi-user spaces
- **Channels & Topics** — community-organized, server-style spaces
- **Threads** — focused sub-conversations inside channels

---

## 2. Problem Statement

> *"Existing chat platforms are either too corporate (Slack, Teams) or too overwhelming for new users (Discord). Gen Z and gamers want something that feels built for them — not adapted from something else."*

**Key Pain Points Identified:**

| Pain Point | Affected Segment |
|---|---|
| Discord's onboarding curve is steep for non-gamers | Casual Gen Z users |
| Slack/Teams feel sterile and enterprise-first | Gamers & communities |
| Instagram DMs lack threading and community features | Social-first users |
| No single platform nails both community AND intimate DM | All target users |
| Poor mobile performance in real-time chat apps | Mobile-first Gen Z |

Lescht solves this by offering a focused, beautifully designed, lightning-fast chat experience that is built for casual-to-power users in the Gen Z and gaming space.

---

## 3. Goals & Success Metrics

### 3.1 Business Goals

- Launch a functional MVP within **Phase 1 (0–3 months)**
- Reach **10,000 registered users** within 6 months post-launch
- Achieve a **DAU/MAU ratio of ≥ 40%** (strong daily engagement)
- Build a community moat through viral room/server invite mechanics

### 3.2 Product Goals

- Sub-**100ms message delivery** latency on the same region
- **99.9% uptime** for the WebSocket infrastructure
- Onboarding completion rate ≥ **70%** (from signup to first message sent)
- Average session length ≥ **12 minutes**

### 3.3 Key Performance Indicators (KPIs)

| Metric | Target (Month 6) |
|---|---|
| Registered Users | 10,000 |
| Daily Active Users (DAU) | 4,000 |
| Messages Sent / Day | 500,000 |
| Avg. Messages Per User / Day | 125 |
| Rooms / Channels Created | 2,000 |
| Median Message Latency | < 100ms |
| Crash-Free Sessions | ≥ 99.5% |

---

## 4. Target Audience & User Personas

### 4.1 Primary Audience

- **Age:** 14–26
- **Behaviors:** Heavy mobile usage, gaming (PC/console/mobile), short-form content consumers, community-driven
- **Platforms they already use:** Discord, TikTok, Instagram, Twitch

---

### 4.2 User Personas

---

**Persona 1 — "The Gamer"**

> **Name:** Kai, 19  
> **Occupation:** College student, part-time streamer  
> **Goals:** Coordinate with their gaming squad, share clips/memes, have a home base for their community  
> **Frustrations:** Discord feels bloated; can't easily set up lightweight rooms for a quick gaming session  
> **Lescht use case:** Creates a Group Room for nightly gaming sessions, uses Channels for their Twitch community, DMs teammates  

---

**Persona 2 — "The Social Butterfly"**

> **Name:** Zara, 17  
> **Occupation:** High school student  
> **Goals:** Stay connected with friend groups, discover new communities, express herself visually  
> **Frustrations:** Instagram DMs are cluttered; group chats have no structure  
> **Lescht use case:** Uses DMs for close friends, joins aesthetic/hobby Channels, follows Threads on topics she cares about  

---

**Persona 3 — "The Community Builder"**

> **Name:** Marcus, 23  
> **Occupation:** Game modder, content creator  
> **Goals:** Build and moderate a community around his game mod; organize announcements, discussion, support topics  
> **Frustrations:** Discord is powerful but overwhelming to set up for newcomers  
> **Lescht use case:** Creates a community server with organized Channels (announcements, mods, off-topic), uses Threads for mod releases  

---

## 5. Competitive Landscape

| Feature | Lescht | Discord | Slack | Instagram DMs | Telegram |
|---|:---:|:---:|:---:|:---:|:---:|
| Real-time messaging | ✅ | ✅ | ✅ | ✅ | ✅ |
| Group Rooms | ✅ | ✅ | ✅ | ❌ | ✅ |
| Channels & Topics | ✅ | ✅ | ✅ | ❌ | ✅ |
| Threaded conversations | ✅ | ✅ | ✅ | ❌ | ❌ |
| Gen Z / gaming identity | ✅ | ✅ | ❌ | ✅ | ❌ |
| Lightweight onboarding | ✅ | ❌ | ❌ | ✅ | ✅ |
| Open/public communities | ✅ | ✅ | ❌ | ❌ | ✅ |
| Mobile-first UX | ✅ | ⚠️ | ❌ | ✅ | ✅ |

**Lescht's strategic advantage:** The intersection of Discord's community depth + Instagram's ease of use + a design language native to Gen Z.

---

## 6. Product Overview & Architecture

### 6.1 High-Level Product Map

```
Lescht
├── Auth Layer
│   ├── Sign up / Log in (email, OAuth)
│   └── Onboarding Flow
│
├── Home Feed / Inbox
│   ├── DM List
│   └── Joined Rooms & Channels
│
├── Direct Messages
│   ├── 1:1 DMs
│   └── Group DMs (up to 10 users)
│
├── Group Rooms
│   ├── Public / Private toggle
│   ├── Invite link generation
│   └── Ephemeral or Persistent mode
│
├── Servers / Communities
│   ├── Channels (text)
│   ├── Topics (channel categories)
│   └── Threads (per message)
│
├── Real-Time Engine (Socket.io)
│   ├── Message delivery
│   ├── Typing indicators
│   ├── Presence / Online status
│   └── Read receipts
│
└── Profile & Settings
    ├── User profile + avatar
    ├── Status / Bio
    └── Notification preferences
```

### 6.2 System Architecture Overview

```
[Client: React.js SPA — Tailwind CSS + Redux]
        |
        | HTTPS REST + WebSocket (Socket.io)
        |
[Express.js Server — Node.js]
        |
   ┌────┴────┐
[REST API]  [Socket.io Server]
   |              |
[JWT Auth]   [Room Manager]
   |              |
[MongoDB Atlas]  [Redis (ioredis)]  ←→  [Socket.io Redis Adapter]
              [Redis Cache]
                  |
           [Message Store (MongoDB)]
           [Media Store (Cloudflare R2 / Multer)]
```

---

## 7. Feature Requirements

---

### 7.1 Authentication & Onboarding

#### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| AUTH-01 | Users can sign up with email + password | P0 |
| AUTH-02 | Users can sign up / log in with Google OAuth | P0 |
| AUTH-03 | Email verification required before full access | P1 |
| AUTH-04 | JWT-based session tokens (access + refresh) | P0 |
| AUTH-05 | Onboarding wizard: set username, avatar, interests | P1 |
| AUTH-06 | Username must be unique, 3–20 chars, alphanumeric + underscores | P0 |
| AUTH-07 | Password reset via email | P1 |
| AUTH-08 | "Remember me" persistent session (30 days) | P2 |

#### Onboarding Flow

```
Sign Up → Email Verify → Set Username → Upload Avatar → Pick Interests → 
Suggested Rooms/Channels → Land on Home
```

---

### 7.2 Direct Messages (DMs)

Direct Messages are private, end-to-end encrypted (E2EE in future), real-time conversations between two users.

#### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| DM-01 | Users can initiate a DM with any registered user by username | P0 |
| DM-02 | Messages are delivered in real-time via Socket.io | P0 |
| DM-03 | Message history is persisted and paginated (50 messages/load) | P0 |
| DM-04 | Users can send: text, emoji, GIFs, images (up to 10MB), files (up to 25MB) | P1 |
| DM-05 | Typing indicator shown when the other user is composing | P0 |
| DM-06 | Read receipts (single check = delivered, double check = read) | P1 |
| DM-07 | Users can react to messages with emoji | P1 |
| DM-08 | Users can reply to a specific message (inline reply) | P1 |
| DM-09 | Users can edit their own messages (edited label shown) | P1 |
| DM-10 | Users can delete their own messages | P0 |
| DM-11 | Users can pin messages in a DM | P2 |
| DM-12 | Users can mute, block, or report another user from a DM | P1 |
| DM-13 | DM list sorted by most recent activity | P0 |
| DM-14 | Unread count badge per DM thread | P0 |

---

### 7.3 Group Rooms

Group Rooms are real-time chat spaces for 2–50 users, created with minimal friction.

#### Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| ROOM-01 | Any user can create a Group Room with a name + optional avatar | P0 |
| ROOM-02 | Rooms can be **Public** (discoverable) or **Private** (invite-only) | P0 |
| ROOM-03 | Invite link generation with optional expiry (1h / 24h / 7d / no expiry) | P0 |
| ROOM-04 | Room creator becomes admin; can promote/demote members | P1 |
| ROOM-05 | Max 50 concurrent members per Room (MVP) | P0 |
| ROOM-06 | All DM features apply within Rooms (reactions, replies, edits, etc.) | P0 |
| ROOM-07 | Online member list visible in sidebar | P0 |
| ROOM-08 | Rooms can be **Ephemeral** (auto-delete after 24h of inactivity) | P2 |
| ROOM-09 | Rooms can be **Persistent** (messages stored indefinitely) | P0 |
| ROOM-10 | Room admin can pin up to 10 messages | P1 |
| ROOM-11 | Room admin can remove members | P1 |
| ROOM-12 | Room admin can set a topic/description (280 chars) | P1 |
| ROOM-13 | Members can leave a Room at any time | P0 |
| ROOM-14 | "Room Discovery" tab showing public rooms by category/tags | P2 |

---

### 7.4 Channels & Topics

Channels are organized, server-style text spaces within a **Community** (a named, community entity). Topics are category-level groupings of Channels.

#### Community

| ID | Requirement | Priority |
|---|---|---|
| COMM-01 | Users can create a **Community** (name, avatar, description, tags) | P0 |
| COMM-02 | Community can be **Public** or **Private** | P0 |
| COMM-03 | Community has an invite link system identical to Rooms | P0 |
| COMM-04 | Community owner can assign roles: Owner, Admin, Moderator, Member | P1 |
| COMM-05 | Community supports up to 500 members (MVP) | P0 |

#### Topics (Channel Categories)

| ID | Requirement | Priority |
|---|---|---|
| TOPIC-01 | Admins can create Topics (category headers) to group Channels | P0 |
| TOPIC-02 | Topics are collapsible in the sidebar | P1 |
| TOPIC-03 | Topics can be reordered via drag-and-drop (admin only) | P2 |

#### Channels

| ID | Requirement | Priority |
|---|---|---|
| CHAN-01 | Admins can create text Channels within a Topic | P0 |
| CHAN-02 | Channel has a name (e.g., `#general`, `#off-topic`) and optional description | P0 |
| CHAN-03 | Channels support all message types (text, media, GIFs, files) | P0 |
| CHAN-04 | Channels can be **read-only** (e.g., announcements) | P1 |
| CHAN-05 | Channels can have role-based access permissions | P1 |
| CHAN-06 | Slow mode: admin can set a per-user message cooldown (e.g., 10s, 30s, 60s) | P2 |
| CHAN-07 | Unread indicator per channel in sidebar | P0 |
| CHAN-08 | Mention system: `@username`, `@everyone`, `@here` | P1 |

---

### 7.5 Threads

Threads allow focused sub-conversations spawned from a specific message in a Channel.

| ID | Requirement | Priority |
|---|---|---|
| THR-01 | Any member can start a Thread from any Channel message | P0 |
| THR-02 | Thread appears as an expandable panel or side view | P0 |
| THR-03 | Thread has its own message history, reactions, and replies | P0 |
| THR-04 | Thread title auto-populates from the original message (editable) | P1 |
| THR-05 | Thread participants get notifications on new replies | P1 |
| THR-06 | Channel shows a "X replies" indicator on messages with active threads | P0 |
| THR-07 | Threads can be archived by admins/moderators | P2 |
| THR-08 | Active threads listed in a "Threads" sidebar tab within a community | P2 |

---

### 7.6 Real-Time Engine (Socket.io)

The real-time layer is the core of Lescht's technical infrastructure.

#### Events

| Event Name | Direction | Description |
|---|---|---|
| `message:send` | Client → Server | Send a new message |
| `message:new` | Server → Client | Broadcast new message to room/channel |
| `message:edit` | Client → Server | Edit an existing message |
| `message:delete` | Client → Server | Delete a message |
| `message:react` | Client → Server | Add/remove emoji reaction |
| `typing:start` | Client → Server | User started typing |
| `typing:stop` | Client → Server | User stopped typing |
| `typing:update` | Server → Client | Broadcast typing state to others |
| `presence:update` | Server → Client | User online/offline/away status change |
| `read:receipt` | Client → Server | Mark messages as read |
| `room:join` | Client → Server | Join a Socket.io room |
| `room:leave` | Client → Server | Leave a Socket.io room |
| `thread:new` | Server → Client | New thread started on a message |
| `thread:reply` | Server → Client | New reply in a thread |

#### Requirements

| ID | Requirement | Priority |
|---|---|---|
| RT-01 | Socket.io rooms scoped per DM, Group Room, and Channel | P0 |
| RT-02 | Redis adapter used for horizontal Socket.io scaling | P0 |
| RT-03 | Automatic reconnection with exponential backoff on client | P0 |
| RT-04 | Message delivery acknowledgment (ACK) system | P1 |
| RT-05 | Optimistic UI: message shown immediately, confirmed/retried on ACK | P1 |
| RT-06 | Presence heartbeat every 30 seconds | P0 |
| RT-07 | Graceful degradation to polling if WebSocket unavailable | P2 |

---

### 7.7 Notifications

| ID | Requirement | Priority |
|---|---|---|
| NOTIF-01 | In-app notification bell with unread count | P0 |
| NOTIF-02 | Push notifications for: new DMs, @mentions, thread replies | P1 |
| NOTIF-03 | Browser push notifications (Web Push API) | P1 |
| NOTIF-04 | Per-channel notification settings: All, Mentions Only, Mute | P1 |
| NOTIF-05 | Global Do Not Disturb mode with scheduled quiet hours | P2 |
| NOTIF-06 | Email notification digest (daily summary of missed activity) | P2 |

---

### 7.8 User Profiles & Presence

| ID | Requirement | Priority |
|---|---|---|
| PROF-01 | User profile: avatar, username, display name, bio (160 chars), join date | P0 |
| PROF-02 | Custom status (text + emoji, max 60 chars) | P1 |
| PROF-03 | Presence states: Online (green), Idle (yellow), Do Not Disturb (red), Invisible (grey) | P1 |
| PROF-04 | Mutual servers/rooms shown on profile | P2 |
| PROF-05 | Profile banner image (customizable) | P2 |
| PROF-06 | Badges for early adopters, active members, etc. | P3 |
| PROF-07 | Link social accounts (Twitch, Steam, YouTube) | P3 |

---

### 7.9 Moderation & Safety

| ID | Requirement | Priority |
|---|---|---|
| MOD-01 | Users can report messages, users, rooms, or communities | P0 |
| MOD-02 | Admins/mods can delete any message in their community | P0 |
| MOD-03 | Admins/mods can kick or ban users from a room/community | P0 |
| MOD-04 | Word filter / auto-moderation with configurable keyword list | P1 |
| MOD-05 | Rate limiting: max 5 messages/second per user (server-enforced) | P0 |
| MOD-06 | Link preview sandboxing and malicious URL detection | P1 |
| MOD-07 | Age gate: date of birth required at signup, COPPA compliance | P1 |
| MOD-08 | Global ban list for repeat offenders (platform-level) | P1 |
| MOD-09 | Audit log for admin actions within a community | P2 |

---

### 7.10 Search

| ID | Requirement | Priority |
|---|---|---|
| SRCH-01 | Search messages within a Channel or DM (text match) | P1 |
| SRCH-02 | Search by user across the platform | P1 |
| SRCH-03 | Search public Communities by name / tags | P1 |
| SRCH-04 | Filter search by: user, date range, has media, has links | P2 |
| SRCH-05 | Full-text search powered by PostgreSQL FTS or Elasticsearch | P2 |

---

## 8. Non-Functional Requirements

### 8.1 Performance

| Metric | Target |
|---|---|
| Message delivery latency (P95) | < 100ms (same region) |
| API response time (P95) | < 200ms |
| Page load time (initial) | < 2 seconds on 4G |
| WebSocket connection establishment | < 500ms |
| Concurrent users (MVP) | 5,000 |
| Concurrent users (Scale target) | 100,000+ |

### 8.2 Availability & Reliability

- **Uptime SLA:** 99.9% (≤ 8.7 hours downtime/year)
- Zero-downtime deployments via blue/green or rolling deploys
- Automatic failover for database and Socket.io servers
- Message queue (Redis Streams or BullMQ) for guaranteed delivery

### 8.3 Scalability

- Stateless REST API horizontally scalable behind load balancer
- Socket.io servers scaled horizontally using Redis Pub/Sub adapter
- Database: PostgreSQL with read replicas for high-read workloads
- CDN for all static assets and media uploads

### 8.4 Accessibility

- WCAG 2.1 Level AA compliance
- Full keyboard navigation
- Screen reader support (ARIA labels on all interactive elements)
- High-contrast mode
- Font size adjustability

---

## 9. Technical Architecture

### 9.1 Tech Stack

| Layer | Technology | Abhishek's Experience |
|---|---|---|
| **Frontend** | React.js + JavaScript | ✅ Used in 1Clik HR + MagicURL |
| **Styling** | Tailwind CSS + Bootstrap | ✅ Listed skill |
| **State Management** | Redux | ✅ Listed skill |
| **Backend API** | Node.js + Express.js | ✅ Used in both projects |
| **Database** | MongoDB + Mongoose | ✅ Used in both projects |
| **Real-Time** | Socket.io (client + server) | ⚠️ New — small learning curve |
| **Cache / PubSub** | Redis (ioredis) | ⚠️ New — simple key-value API |
| **Auth** | JWT + Google OAuth (Passport.js) | ✅ Implemented in 1Clik |
| **File Uploads** | Multer + Cloudflare R2 | ✅ Multer common with Express |
| **Search** | MongoDB Text Index (MVP) | ✅ MongoDB comfort zone |
| **Queue** | Node.js EventEmitter / Bull (MVP) | ⚠️ Simple queue pattern |
| **Deployment** | Vercel (frontend) + Render (backend) | ✅ Used in 1Clik deploy |
| **Database Hosting** | MongoDB Atlas | ✅ Used in both projects |
| **CI/CD** | GitHub Actions | ✅ Listed skill |
| **Containers** | Docker + Docker Compose (local dev) | ✅ Listed skill |
| **Monitoring** | Sentry (errors) | ⚠️ Easy SDK integration |

### 9.2 Folder Structure

```
lescht/
├── client/                          # React.js frontend (CRA or Vite)
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── chat/
│       │   │   ├── MessageList.jsx
│       │   │   ├── MessageItem.jsx
│       │   │   ├── MessageInput.jsx
│       │   │   ├── TypingIndicator.jsx
│       │   │   └── ReactionBar.jsx
│       │   ├── layout/
│       │   │   ├── Sidebar.jsx
│       │   │   ├── CommunitySidebar.jsx
│       │   │   └── MemberList.jsx
│       │   └── ui/                  # Reusable: Button, Avatar, Badge, Modal
│       ├── pages/
│       │   ├── Auth/                # Login, Register (same pattern as 1Clik)
│       │   ├── DM/
│       │   ├── Room/
│       │   └── Community/
│       ├── redux/                   # Redux store + slices
│       │   ├── store.js
│       │   └── slices/
│       │       ├── authSlice.js
│       │       ├── chatSlice.js
│       │       └── presenceSlice.js
│       ├── hooks/
│       │   ├── useSocket.js         # Socket.io client hook
│       │   └── useAuth.js
│       ├── utils/
│       │   └── axios.js             # Axios instance with JWT interceptor
│       └── App.jsx
│
├── server/                          # Node.js + Express.js backend
│   ├── models/                      # Mongoose schemas
│   │   ├── User.model.js
│   │   ├── Message.model.js
│   │   ├── Room.model.js
│   │   ├── Community.model.js
│   │   ├── Channel.model.js
│   │   ├── Thread.model.js
│   │   └── RefreshToken.model.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── dm.routes.js
│   │   ├── room.routes.js
│   │   ├── community.routes.js
│   │   ├── channel.routes.js
│   │   └── message.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js       # Same pattern as 1Clik
│   │   ├── message.controller.js
│   │   └── room.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js       # verifyJWT — copied from 1Clik
│   │   └── role.middleware.js       # requireRole — extended from 1Clik RBAC
│   ├── socket/
│   │   ├── index.js                 # Socket.io server init + Redis adapter
│   │   └── handlers/
│   │       ├── message.handler.js
│   │       ├── typing.handler.js
│   │       └── presence.handler.js
│   ├── config/
│   │   ├── db.js                    # MongoDB Atlas connection
│   │   └── redis.js                 # Redis (ioredis) connection
│   └── index.js                     # Express app entry point
│
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Actions CI/CD
├── docker-compose.yml               # Local dev: MongoDB + Redis
└── .env.example
```

---

## 10. Data Models

> All models use **Mongoose** with **MongoDB Atlas**. Same ODM pattern used in Abhishek's 1Clik HR System and MagicURL projects.

### User
```javascript
const UserSchema = new mongoose.Schema({
  username:     { type: String, unique: true, required: true, minlength: 3, maxlength: 20 },
  displayName:  { type: String, maxlength: 50 },
  email:        { type: String, unique: true, required: true },
  passwordHash: { type: String },               // null for Google OAuth users
  googleId:     { type: String },               // same as 1Clik Google OAuth
  avatarUrl:    { type: String },
  bio:          { type: String, maxlength: 160 },
  status:       { type: String, enum: ['ONLINE','IDLE','DND','INVISIBLE','OFFLINE'], default: 'OFFLINE' },
  customStatus: { type: String, maxlength: 60 },
  createdAt:    { type: Date, default: Date.now }
})
```

### Message
```javascript
// Exactly ONE of dmId / roomId / channelId / threadId will be set per message
// Same nullable-FK pattern used in MagicURL URL mappings
const MessageSchema = new mongoose.Schema({
  content:    { type: String, required: true },
  authorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dmId:       { type: mongoose.Schema.Types.ObjectId, ref: 'DM',      default: null },
  roomId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Room',     default: null },
  channelId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Channel',  default: null },
  threadId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Thread',   default: null },
  replyToId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Message',  default: null },
  reactions:  [{ emoji: String, users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }],
  editedAt:   { type: Date, default: null },
  deletedAt:  { type: Date, default: null },
  createdAt:  { type: Date, default: Date.now }
})
MessageSchema.index({ roomId: 1, createdAt: -1 })
MessageSchema.index({ channelId: 1, createdAt: -1 })
MessageSchema.index({ content: 'text' })          // MongoDB text index for search
```

### Room
```javascript
const RoomSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, maxlength: 280 },
  type:        { type: String, enum: ['PUBLIC','PRIVATE'], default: 'PUBLIC' },
  mode:        { type: String, enum: ['EPHEMERAL','PERSISTENT'], default: 'PERSISTENT' },
  inviteCode:  { type: String, unique: true },    // short random slug — same as MagicURL short-codes
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members:     [{ userId: mongoose.Schema.Types.ObjectId, role: { type: String, enum: ['OWNER','ADMIN','MODERATOR','MEMBER'] } }],
  createdAt:   { type: Date, default: Date.now }
})
```

### Community
```javascript
const CommunitySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  avatarUrl:   { type: String },
  type:        { type: String, enum: ['PUBLIC','PRIVATE'], default: 'PUBLIC' },
  inviteCode:  { type: String, unique: true },
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members:     [{ userId: mongoose.Schema.Types.ObjectId, role: String }],
  createdAt:   { type: Date, default: Date.now }
})
```

### Channel
```javascript
// Lives inside a Community, grouped by topicName string
const ChannelSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  topicName:   { type: String, default: 'General' },   // simple string grouping for MVP
  isReadonly:  { type: Boolean, default: false },
  slowModeSec: { type: Number, default: 0 },
  position:    { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
})
```

### Thread
```javascript
const ThreadSchema = new mongoose.Schema({
  title:       { type: String, maxlength: 200 },
  channelId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  originMsgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', unique: true },
  creatorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  archivedAt:  { type: Date, default: null },
  createdAt:   { type: Date, default: Date.now }
})
```

### RefreshToken
```javascript
// Same pattern as 1Clik JWT refresh implementation
const RefreshTokenSchema = new mongoose.Schema({
  token:     { type: String, unique: true, required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
})
```

---

## 11. API Specification (REST + WebSocket)

### 11.1 REST Endpoints

#### Auth
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
POST   /api/auth/google
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
```

#### Users
```
GET    /api/users/:username
PATCH  /api/users/me
PUT    /api/users/me/avatar
DELETE /api/users/me
```

#### Direct Messages
```
GET    /api/dms
POST   /api/dms/:userId
GET    /api/dms/:dmId/messages
DELETE /api/dms/:dmId
```

#### Rooms
```
GET    /api/rooms
POST   /api/rooms
GET    /api/rooms/:roomId
PATCH  /api/rooms/:roomId
DELETE /api/rooms/:roomId
POST   /api/rooms/:roomId/join
POST   /api/rooms/:roomId/leave
GET    /api/rooms/:roomId/messages
POST   /api/rooms/:roomId/invite
```

#### Communities
```
POST   /api/communities
GET    /api/communities/:communityId
PATCH  /api/communities/:communityId
DELETE /api/communities/:communityId
POST   /api/communities/:communityId/join
POST   /api/communities/:communityId/leave
GET    /api/communities/discover
```

#### Channels & Threads
```
GET    /api/communities/:communityId/channels
POST   /api/communities/:communityId/channels
GET    /api/channels/:channelId/messages
POST   /api/messages/:messageId/threads
GET    /api/threads/:threadId/messages
```

#### Messages
```
POST   /api/messages
PATCH  /api/messages/:messageId
DELETE /api/messages/:messageId
POST   /api/messages/:messageId/reactions
DELETE /api/messages/:messageId/reactions/:emoji
POST   /api/messages/:messageId/report
```

### 11.2 WebSocket Namespaces

```
/chat     — All message events (DM, Room, Channel, Thread)
/presence — User presence and status updates
```

---

## 12. UI/UX Requirements

### 12.1 Design Principles

1. **Dark mode first** — default dark theme with optional light mode
2. **Mobile-first responsive** — full feature parity on mobile PWA
3. **Low friction** — never more than 2 taps/clicks to start chatting
4. **Expressive** — rich emoji, GIF, and reaction support everywhere
5. **Fast feedback** — optimistic UI updates, skeleton loaders, no blank states

### 12.2 Core Screens

| Screen | Description |
|---|---|
| Home / Inbox | DM list + joined rooms/channels, sorted by recent activity |
| DM View | Full chat view with message history, input bar, reply, reactions |
| Group Room View | Chat view + member sidebar, room info panel |
| Community Sidebar | Topic → Channel tree, member count, search |
| Channel View | Chat view with thread launcher panel |
| Thread Panel | Side panel (desktop) or full screen (mobile) for thread replies |
| Profile View | Avatar, bio, status, mutual communities, social links |
| Settings | Account, notifications, appearance, privacy |
| Discovery | Browse public communities and rooms |
| Onboarding Flow | 4-step wizard: username → avatar → interests → suggestions |

### 12.3 Design Language

- **Color palette:** Deep dark backgrounds (`#0f0f13`), accent neon (customizable per user theme)
- **Typography:** Inter — clean, modern, legible
- **Iconography:** Lucide React (lightweight, tree-shakeable)
- **Styling:** Tailwind CSS utility classes + Bootstrap components where needed
- **Animations:** CSS transitions + lightweight React state toggles (no heavy animation lib needed for MVP)
- **Message input:** Auto-resizing textarea, inline emoji picker, drag-to-upload via Multer, slash commands (`/giphy`, `/shrug`)

---

## 13. Security Requirements

| ID | Requirement |
|---|---|
| SEC-01 | All API endpoints require authentication (JWT Bearer) except auth routes |
| SEC-02 | HTTPS enforced everywhere; HSTS headers set |
| SEC-03 | Passwords hashed with bcrypt (cost factor ≥ 12) |
| SEC-04 | JWT access tokens expire in 15 minutes; refresh tokens in 30 days |
| SEC-05 | Refresh token rotation on every use |
| SEC-06 | Rate limiting: 100 req/min per IP on auth routes, 1000 req/min on general routes |
| SEC-07 | CORS restricted to allowed origins |
| SEC-08 | Input validation and sanitization on all user-generated content |
| SEC-09 | NoSQL injection prevention via Mongoose schema validation + sanitize-html |
| SEC-10 | XSS prevention: all message content rendered as escaped text (no raw HTML) |
| SEC-11 | File upload validation: type whitelist, virus scan (ClamAV or cloud equiv.) |
| SEC-12 | Content Security Policy (CSP) headers |
| SEC-13 | Socket.io connections authenticated via JWT on handshake |
| SEC-14 | Private rooms/channels inaccessible without valid invite/membership |

---

## 14. Milestones & Phased Roadmap

### Phase 1 — MVP (Months 0–3)

**Goal:** Ship a working, stable core product.  
**Stack:** React.js + Redux + Tailwind CSS · Node.js + Express.js · MongoDB Atlas · Socket.io

- [ ] Auth: email/password + Google OAuth *(copy pattern from 1Clik)*
- [ ] JWT access + refresh token rotation *(extend 1Clik auth)*
- [ ] Onboarding wizard (username → avatar → interests)
- [ ] 1:1 DMs with real-time delivery (Socket.io)
- [ ] Group Rooms (public/private, invite links) *(invite code = MagicURL short-code pattern)*
- [ ] Community creation + text Channels
- [ ] Topics (channel category grouping)
- [ ] Threads (basic — side panel)
- [ ] Typing indicators + presence (Redis key-value)
- [ ] Emoji reactions
- [ ] Basic profile pages
- [ ] Role-based access *(extend 1Clik admin/employee RBAC)*
- [ ] Dark mode UI (Tailwind dark: classes)
- [ ] Report/moderation tools (MVP)
- [ ] Deploy: Vercel (frontend) + Render (backend) + MongoDB Atlas *(same as 1Clik)*
- [ ] GitHub Actions CI/CD pipeline *(same as existing workflow)*

---

### Phase 2 — Growth (Months 3–6)

**Goal:** Improve retention and engagement.

- [ ] Push notifications (Web Push)
- [ ] GIF picker (Tenor/Giphy integration)
- [ ] Read receipts in DMs
- [ ] Mention system (`@user`, `@everyone`)
- [ ] Role-based channel permissions
- [ ] Community Discovery page
- [ ] Slash commands in message input
- [ ] Message search within channels
- [ ] Pinned messages
- [ ] Slow mode + channel read-only mode
- [ ] Mobile PWA improvements (offline indicator, install prompt)

---

### Phase 3 — Scale (Months 6–12)

**Goal:** Platform maturity and scale.

- [ ] Voice rooms (WebRTC — `simple-peer` library)
- [ ] Video chat (1:1 DM video call)
- [ ] Custom emoji per community
- [ ] User badges + achievements
- [ ] Social links on profile (Twitch, Steam, YouTube)
- [ ] Full-text search upgrade (MongoDB Atlas Search — no new DB needed)
- [ ] Advanced moderation (audit logs, auto-mod rules)
- [ ] Public API for community bots
- [ ] Analytics dashboard for community admins
- [ ] Monetization exploration (Lescht Premium / boosts)

---

## 15. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| WebSocket scaling bottleneck | Medium | High | Redis Pub/Sub adapter (ioredis); horizontal Socket.io scaling |
| Message delivery failures under load | Medium | High | Socket.io ACK callbacks + retry on client |
| MongoDB write bottleneck on messages | Medium | High | Proper indexes on `roomId + createdAt`; Redis cache for last 50 messages |
| Spam/abuse in public rooms | High | High | Express rate-limit middleware, word filters, fast report pipeline |
| COPPA non-compliance (under-13 users) | Medium | High | Date of birth gate, privacy-by-default for minors |
| Cold start / empty community problem | High | Medium | Seed discovery page with curated starter communities |
| Socket.io unfamiliarity slowing dev | Low | Medium | Small API surface — `emit`, `on`, `join`, `to` cover 95% of use cases |
| Redis unfamiliarity slowing dev | Low | Medium | Only 3 Redis operations needed for MVP (SET, INCR, LPUSH) |
| Low Day-1 retention | Medium | High | Frictionless onboarding + friend import + interesting first-run suggestions |
| Feature creep delaying MVP | High | Medium | Strict P0/P1/P2 prioritization; cut P2 items if timeline slips |

---

## 16. Open Questions

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Use Vite or CRA for the React frontend? (Vite recommended for speed) | Abhishek | Open |
| 2 | What is the monetization model for Phase 1? (Free? Freemium? Ads?) | Business | Open |
| 3 | Should communities be called "Servers" (Discord-familiar) or something unique? | Design | Open |
| 4 | Do we support E2EE for DMs in Phase 1 or defer to Phase 2? | Abhishek | Open |
| 5 | What is the message retention policy for free vs. premium users? | Product | Open |
| 6 | Should Group Rooms and Communities be separate concepts, or merged? | Product | Open |
| 7 | Use Cloudflare R2 or keep file uploads in MongoDB GridFS for MVP simplicity? | Abhishek | Open |
| 8 | Add TypeScript gradually or stay plain JavaScript for faster MVP? | Abhishek | Open |

---

## 17. Glossary

| Term | Definition |
|---|---|
| **DM** | Direct Message — a private 1:1 real-time conversation between two users |
| **Group Room** | A multi-user (up to 50) real-time chat space, can be public or private |
| **Community** | A named server-style entity containing Topics, Channels, and members |
| **Topic** | A category string grouping inside a Community that organizes related Channels |
| **Channel** | A persistent text chat space within a Community Topic (e.g., `#general`) |
| **Thread** | A focused sub-conversation started from a specific message in a Channel |
| **Socket.io** | JavaScript real-time bidirectional event-based communication library |
| **Presence** | A user's visible online state (Online, Idle, DND, Invisible) stored in Redis |
| **ACK** | Acknowledgment — Socket.io callback confirming the server received a message |
| **Redis Adapter** | Socket.io plugin enabling message broadcasting across multiple server instances via Redis Pub/Sub |
| **Mongoose** | MongoDB ODM (Object Data Modeling) library for Node.js — used for all DB schemas |
| **Redux** | Predictable state container for React — manages auth, chat, and presence state client-side |
| **Optimistic UI** | UI pattern where the client shows changes immediately before server confirmation |
| **JWT** | JSON Web Token — signed token used for stateless authentication (used in 1Clik) |
| **RBAC** | Role-Based Access Control — permission system (Owner/Admin/Moderator/Member) extended from 1Clik |
| **Invite Code** | Unique short random string for joining a Room or Community — same pattern as MagicURL short-codes |
| **P0/P1/P2/P3** | Priority levels: P0 = must-have for launch, P1 = important, P2 = nice-to-have, P3 = future |

---

*Document maintained by Abhishek Anand. For questions or contributions, open a GitHub issue at github.com/Abhishek1232455 or message `#product` in the Lescht internal community.*

---
**© 2026 Lescht — Built by Abhishek Anand. All rights reserved.**

