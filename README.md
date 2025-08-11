# LOTS Task Manager (Practical Interview)

A small, production-sane task manager built for a hackathon.

Monorepo:
- **/server** – Node.js + Express + Prisma + MySQL + JWT (HttpOnly cookie)
- **/client** – Vite + React 18 + MUI v5

## Live Links

- **Frontend (Vercel):** https://lots-nu.vercel.app/
- **Backend (Render):** https://lots-p99v.onrender.com
- **Health check:** https://lots-p99v.onrender.com/api/health

> Tip: If you change domains, update `CORS_ORIGINS` on the server and `VITE_API_BASE_URL` on the client.

---

## Why I used these Technologies

**Node.js + Express (Server)**
- Fast to scaffold, minimal abstractions, fits the interviews limited time.
- Large ecosystem (CORS, Helmet, rate limiting, cookie parsing) to harden quickly.

**Prisma ORM + MySQL**
- Prisma’s schema-first DX makes modeling + migrations fast and safe.
- MySQL is widely available on free tiers (Railway/PlanetScale), easy to run locally.

**JWT in HttpOnly Cookie**
- Avoids localStorage/sessionStorage pitfalls; HttpOnly defends against XSS token theft.
- With `SameSite=None; Secure` in production, works cleanly across Vercel (web) and Render (API).

**Zod Validation**
- Explicit request validation per route → better error messages & secure defaults.

**Helmet + CORS + Rate Limiting**
- Adds sensible security headers, strict cross-origin policy, and DoS protection quickly.

**Vite + React + MUI (Client)**
- Vite is ultra-fast for dev & builds; React 18 is familiar and productive.
- MUI v5 gives an accessible, responsive UI with minimal custom CSS.

**Free Tiers Used**
- **Backend:** Render (Free Web Service)
- **Database:** Railway (Free MySQL) *(PlanetScale would also work)*
- **Frontend:** Vercel (Hobby)

These services let us deploy quickly with zero infra cost, ideal for hackathon time constraints.

---

## Features

- User signup/login/logout with secure JWT cookie
- CRUD Tasks: create, list (pagination + search), get by id, update, delete
- Owner scoping: users only see their own tasks
- Input validation (Zod), security headers (Helmet), rate limiting, CORS
- **Optional AI assist (in code):** `/api/ai/suggest` (disabled if no valid OpenAI key). If we had more time, we’d polish the model & prompts.

---

## API Overview

Base URL: `https://lots-p99v.onrender.com/api`

### Auth
- `POST /auth/signup` → `{ email, password, name? }`
- `POST /auth/login` → `{ email, password }`
- `GET  /auth/me` → returns current user (requires cookie)
- `POST /auth/logout` → clears cookie

### Tasks (auth required)
- `POST   /tasks` → `{ title, description? }`
- `GET    /tasks?page=&limit=&q=` → pagination + search
- `GET    /tasks/:id`
- `PATCH  /tasks/:id` → `{ title?, description? }`
- `DELETE /tasks/:id`

### AI (optional)
- `POST /ai/suggest` → `{ title?, description? }` → returns improved title/summary  
  *(Requires `OPENAI_API_KEY` and a valid model; gracefully returns error if missing/invalid.)*

---

## Local Development

### Prereqs
- **Windows 11**, **PowerShell** or **Git Bash**
- **Node 22+** (you’re on v22.13.1)
- **MySQL** local (via MySQL Workbench)  
  Create a DB named `lots_dev` (or use any name and update `DATABASE_URL`).
