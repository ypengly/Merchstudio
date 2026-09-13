# MerchStudio

A browser-based merchandise design studio: pick a T-shirt, hoodie, tote, cap, sweatshirt, or mug, customize it with
text, images, and shapes, and export print-ready artwork.

This is a full-stack scaffold — the pieces run end-to-end (auth, database, uploads, a working Konva-based editor),
but it's a starting point, not a finished commercial product. See **Where to take this next** below.

## Stack

- **Client:** React, TypeScript, Vite, Tailwind CSS, Zustand, Konva (`react-konva`) for the canvas editor
- **Server:** Node.js, Express, TypeScript, Prisma, PostgreSQL
- **Storage:** S3-compatible object storage (MinIO locally, any S3-compatible provider in production)
- **Auth:** Email/password with bcrypt hashing and JWT access + refresh tokens

## Project structure

```
merchstudio/
├── client/          React app (Vite)
├── server/          Express API
├── prisma/          Shared Prisma schema + seed script
├── docker-compose.yml
└── .env.example
```

## Running locally

### 1. Start Postgres and MinIO

```bash
docker compose up postgres minio -d
```

### 2. Set up the server

```bash
cd server
cp .env.example .env    # adjust secrets as needed
npm install
npm run prisma:generate
npm run prisma:migrate   # creates tables
npm run prisma:seed      # seeds products, templates, graphics, and an admin user
npm run dev               # http://localhost:4000
```

Seeded admin login: `admin@merchstudio.dev` / `password123` — change this before deploying anywhere real.

### 3. Set up the client

```bash
cd client
npm install
npm run dev               # http://localhost:5173, proxies /api to the server
```

### 4. Or run everything in Docker

```bash
docker compose up --build
```

## What's implemented

- Register / login / refresh / logout with hashed passwords and JWTs
- Product catalog with color variants
- Design CRUD: create, autosave, rename, favorite, duplicate (for variations), delete
- A working canvas editor (Konva): add text/shapes/images, drag/resize/rotate, layers panel with
  show/hide, lock, and reorder, undo/redo history, contextual property panel
- Image uploads to S3-compatible storage with MIME/size validation
- Brand kit (logo, colors, font) storage
- Shareable read-only design links
- Client-side PNG/JPG export from the canvas
- Rate limiting, input validation (Zod), CORS, and an admin-only route group for products/templates/graphics/stats
- Admin dashboard UI at `/admin` (visible in the nav to `ADMIN`-role users): statistics, product & color-variant
  management, template management (premium/enable toggles), a graphics library manager, and a user list with
  plan/role

## Where to take this next

This scaffold intentionally leaves some things simplified so the whole flow actually runs:

- **Export** is done client-side from the canvas (`toDataURL`). A production version should render exports
  server-side (e.g. with `sharp` or a headless renderer) so "Transparent PNG" and "High Resolution" options are
  real, and so exports can be generated without the editor open.
- **Billing** (Free/Pro/Business) has plan fields on `Subscription` and a free-tier design limit is enforced, but
  there's no Stripe (or other processor) integration yet.
- **Background removal** for uploaded images is mentioned in the spec as "where technically practical" — no
  implementation is included; it would call an external image API.
- **Analytics** for Business accounts isn't built; `DesignVersion` rows give you an export/edit trail to build
  charts from.
- Product mockup images are referenced by URL (`frontImage`/`backImage` on `ProductVariant`) but no real
  photography/mockups are bundled — swap in real assets before shipping.

## Environment variables

See `.env.example` (root) and `server/.env.example` for the full list — database URL, JWT secrets, and S3
credentials are required; everything else has a sane default for local development.
