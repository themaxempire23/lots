@"
# LOTS Task Manager (Hackathon)

Monorepo: **/server** (Express + Prisma + MySQL + JWT cookies) and **/client** (Vite + React + MUI).

## Stack
- Node 22, Express, Prisma, MySQL
- JWT (HttpOnly cookie), Zod, Helmet, CORS, Rate limiting
- Vite + React 18 + MUI v5
- Hosting: Render (API) + Vercel (Web)

## Phases
- [x] Phase 0 — Repo bootstrap
- [ ] Phase 1 — Backend init
- [ ] Phase 2 — Prisma + MySQL
- [ ] Phase 3 — Auth
- [ ] Phase 4 — Tasks CRUD
- [ ] Phase 5 — Frontend init
- [ ] Phase 6 — AI helper (optional)
- [ ] Phase 7 — Deployment
- [ ] Phase 8 — README & polish
"@ | Set-Content README.md -Encoding UTF8

# Minimal package.json placeholders (will be expanded in later phases)

@"
{
  "name": "lots-server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22" },
  "scripts": {
    "dev": "node --version"
  }
}
"@ | Set-Content server\package.json -Encoding UTF8

@"
{
  "name": "lots-client",
  "version": "0.1.0",
  "private": true
}
"@ | Set-Content client\package.json -Encoding UTF8
