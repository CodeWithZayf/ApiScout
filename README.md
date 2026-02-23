<div align="center">

# 🧭 ApiScout

[![Status](https://img.shields.io/badge/status-active-blue?style=for-the-badge)](https://github.com/CodeWithZayf/APIscout)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](./LICENSE)
[![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20NestJS%20%7C%20PostgreSQL-blueviolet?style=for-the-badge)](#-tech-stack)

A full‑stack API discovery platform to discover, compare, review, and bookmark APIs faster.

</div>

---

## Table of contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#-tech-stack)
- [API Reference (quick)](#api-reference-quick)
- [Local Development](#local-development)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

ApiScout centralizes API discovery: search, compare, review, and bookmark APIs across categories so developers can choose the right provider faster and with confidence.

Key goals:

- Fast search and filters
- Clear, developer-focused UI
- Community reviews and ratings
- Lightweight admin workflows for maintaining API entries

---

## Architecture

Frontend (Next.js) → Backend (NestJS REST API) → PostgreSQL (Prisma ORM)

Simple pipeline:

- Next.js handles SSR pages, client interactions, and admin UI
- NestJS implements controllers, services, and Prisma access layers
- PostgreSQL stores normalized data with relations for tags, categories, and users

---

## Features

- Authentication: JWT-based auth with role-based access (Admin / User)
- API Discovery: search, filter, pagination, and category/tag browsing
- Reviews & Ratings: community feedback for API entries
- Bookmarks: users can save APIs to their profile
- Admin: create/update API entries (admin only)
- Docker-ready for production

---

## - Tech Stack

- Frontend: Next.js, TypeScript, TailwindCSS, shadcn/ui
- Backend: NestJS, TypeScript, Prisma ORM
- Database: PostgreSQL
- Infrastructure: Docker, docker-compose, Vercel (frontend)

---

## API Reference (quick)

- POST /auth/register — Register a user
- POST /auth/login — Login and receive JWT
- GET /apis — List APIs (supports pagination and query filters)
- GET /apis?category=<name>&page=<n> — Filtered APIs
- POST /apis — Create API entry (Admin only)
- POST /bookmark — Bookmark an API (authenticated)

---

## Local development

Backend

1. Install dependencies and run dev server:

```bash
cd apps/backend
npm install
npm run start:dev
```

2. Environment variables

Create a `.env` with at least:

```
DATABASE_URL=postgresql://user:password@localhost:5432/apiscout
JWT_SECRET=your_jwt_secret_here
```

Frontend

```bash
cd apps/frontend
npm install
npm run dev
```

---

## Docker

Start both services with docker-compose:

```bash
docker-compose up --build
```

Ensure `.env` is configured for the database before bringing up containers.

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes with clear messages
4. Open a Pull Request
---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

Made with ❤️ to help developers choose better APIs, faster.
