# PredictMarket Backend

A production-ready REST + WebSocket API for a decentralized prediction market platform built with Node.js, TypeScript, PostgreSQL, Redis, and Prisma ORM.

---

## Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Database Setup](#database-setup)
- [Background Jobs](#background-jobs)
- [Deployment](#deployment)

---

## Architecture

```
backend/
├── src/
│   ├── config/           # Environment, database, Redis, CORS config
│   ├── controllers/      # Route handlers (thin layer, delegates to services)
│   ├── jobs/             # BullMQ background job workers & schedulers
│   │   ├── priceSimulation.job.ts   # Simulates live price movements (10s interval)
│   │   ├── marketResolution.job.ts  # Auto-resolves expired markets (1m interval)
│   │   ├── leaderboard.job.ts       # Recomputes leaderboard rankings (5m interval)
│   │   └── priceSnapshot.job.ts     # Records price history snapshots (1m interval)
│   ├── middleware/       # Auth, rate limiting, error handling
│   ├── routes/           # Express route definitions
│   ├── services/         # Business logic (market, trade, user, WebSocket, blockchain)
│   ├── types/            # Shared TypeScript interfaces and types
│   ├── utils/            # Logger, helpers, validation utilities
│   ├── validators/       # Zod request validation schemas
│   ├── app.ts            # Express app factory
│   └── index.ts          # Server entry point, job orchestration, graceful shutdown
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # 30 markets, 5 users, 30 days of price history
├── Dockerfile            # Multi-stage production Docker image
└── docker-compose.yml    # Full stack: API + PostgreSQL 15 + Redis 7
```

### Technology Stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Runtime       | Node.js 20, TypeScript              |
| Web Framework | Express 4                           |
| ORM           | Prisma 5                            |
| Database      | PostgreSQL 15                       |
| Cache / Queue | Redis 7 + BullMQ                    |
| WebSockets    | Socket.IO                           |
| Auth          | JWT (wallet-signature based)        |
| Blockchain    | ethers.js v6 (Polygon)              |
| Logging       | pino + pino-pretty                  |
| Containerized | Docker + Docker Compose             |

### Key Design Decisions

- **CQRS-light**: Controllers stay thin and delegate all business logic to services.
- **BullMQ workers**: Each background job runs in its own named queue with separate worker concurrency, ensuring price simulation, market resolution, leaderboard, and snapshot jobs don't compete.
- **Mean-reversion price model**: Simulated prices drift toward 0.5 with configurable volatility, producing realistic-looking charts during development.
- **Graceful shutdown**: SIGTERM/SIGINT handlers close the HTTP server, disconnect from the DB, and quit Redis before exiting.

---

## Quick Start

### Prerequisites

- Node.js ≥ 20
- Docker & Docker Compose (for the full stack)
- PostgreSQL 15 and Redis 7 (or use Docker Compose)

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start infrastructure (Docker)

```bash
docker-compose up -d postgres redis
```

### 4. Run database migrations & seed

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Start the development server

```bash
npm run dev
```

The API is available at `http://localhost:3001`.

### 6. (Optional) Full stack with Docker Compose

```bash
docker-compose up --build
```

---

## Environment Variables

| Variable           | Required | Default                        | Description                                          |
|--------------------|----------|--------------------------------|------------------------------------------------------|
| `NODE_ENV`         | No       | `development`                  | `development`, `production`, or `test`               |
| `PORT`             | No       | `3001`                         | HTTP server port                                     |
| `DATABASE_URL`     | Yes      | —                              | PostgreSQL connection string                         |
| `REDIS_URL`        | Yes      | —                              | Redis connection string                              |
| `JWT_SECRET`       | Yes      | —                              | Secret for signing JWTs (min 32 chars in production) |
| `JWT_EXPIRES_IN`   | No       | `7d`                           | JWT expiry duration                                  |
| `CORS_ORIGIN`      | No       | `http://localhost:3000`        | Allowed CORS origin(s), comma-separated              |
| `POLYGON_RPC_URL`  | No       | `https://polygon-rpc.com`      | Polygon JSON-RPC endpoint                            |
| `CONTRACT_ADDRESS` | No       | —                              | Deployed PredictMarket smart contract address        |

Example `.env`:

```dotenv
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:password@localhost:5432/predictmarket
REDIS_URL=redis://localhost:6379
JWT_SECRET=super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
POLYGON_RPC_URL=https://polygon-rpc.com
CONTRACT_ADDRESS=
```

---

## API Endpoints

All endpoints are prefixed with `/api`.

### Health

| Method | Path           | Auth | Description          |
|--------|----------------|------|----------------------|
| GET    | `/health`      | No   | Liveness check       |

### Authentication

| Method | Path                | Auth | Description                                      |
|--------|---------------------|------|--------------------------------------------------|
| GET    | `/auth/nonce`       | No   | Get a sign-in nonce for a wallet address         |
| POST   | `/auth/verify`      | No   | Verify signed nonce and receive JWT              |
| GET    | `/auth/me`          | Yes  | Get the authenticated user's profile             |

#### GET `/auth/nonce`

Query parameter: `?walletAddress=0x...`

#### POST `/auth/verify`
```json
{
  "message": "<EIP-4361 SIWE message string>",
  "signature": "0x..."
}
```
Returns:
```json
{ "token": "<jwt>", "user": { "id": "...", "walletAddress": "0x...", "username": "..." } }
```

---

### Markets

| Method | Path                        | Auth | Description                              |
|--------|-----------------------------|------|------------------------------------------|
| GET    | `/markets`                  | No   | List markets (paginated, filterable)     |
| GET    | `/markets/featured`         | No   | Get featured markets                     |
| GET    | `/markets/:id`              | No   | Get a single market with outcomes        |
| POST   | `/markets`                  | Yes  | Create a new market                      |
| POST   | `/markets/:id/resolve`      | Yes  | Resolve a market (admin / creator)       |

#### GET `/markets` Query Parameters

| Param      | Type   | Description                                         |
|------------|--------|-----------------------------------------------------|
| `page`     | number | Page number (default: 1)                            |
| `limit`    | number | Items per page (default: 20, max: 100)              |
| `category` | string | Filter by category (e.g., `Crypto`, `Sports`)       |
| `status`   | string | `ACTIVE`, `RESOLVED`, or `CANCELLED`                |
| `search`   | string | Full-text search on question and description        |
| `featured` | bool   | `true` to return only featured markets              |

#### POST `/markets` Body
```json
{
  "question": "Will BTC hit $200k in 2026?",
  "description": "Detailed resolution criteria...",
  "category": "Crypto",
  "resolutionDate": "2026-12-31T00:00:00.000Z",
  "featured": false
}
```

---

### Trading

| Method | Path                        | Auth | Description                              |
|--------|-----------------------------|------|------------------------------------------|
| POST   | `/trades`                   | Yes  | Place a trade (buy/sell shares)          |
| GET    | `/trades/market/:marketId`  | No   | Get trade history for a market           |
| GET    | `/trades/me`                | Yes  | Get authenticated user's trade history   |

#### POST `/trades` Body
```json
{
  "marketId": "clx...",
  "outcomeId": "clx...",
  "side": "BUY",
  "amount": 50.00
}
```

---

### Positions

| Method | Path                      | Auth | Description                            |
|--------|---------------------------|------|----------------------------------------|
| GET    | `/positions/me`           | Yes  | Get user's open positions              |
| GET    | `/positions/me/summary`   | Yes  | Aggregate PnL and portfolio summary    |

---

### Price History

| Method | Path                                    | Auth | Description                             |
|--------|-----------------------------------------|------|-----------------------------------------|
| GET    | `/markets/:id/price-history`            | No   | Get OHLC price history for a market     |

#### GET `/markets/:id/price-history` Query Parameters

| Param      | Type   | Description                              |
|------------|--------|------------------------------------------|
| `outcomeId`| string | Filter by specific outcome               |
| `from`     | string | ISO 8601 start timestamp                 |
| `to`       | string | ISO 8601 end timestamp                   |
| `interval` | string | `1h`, `4h`, `1d` (default: `1h`)         |

---

### Leaderboard

| Method | Path                 | Auth | Description                       |
|--------|----------------------|------|-----------------------------------|
| GET    | `/leaderboard`       | No   | Top traders by PnL                |
| GET    | `/leaderboard/me`    | Yes  | Authenticated user's rank & stats |

---

### Users

| Method | Path                   | Auth | Description                       |
|--------|------------------------|------|-----------------------------------|
| GET    | `/users/:address`      | No   | Get public user profile           |
| PATCH  | `/users/me`            | Yes  | Update username / avatar          |

---

### Comments

| Method | Path                          | Auth | Description                       |
|--------|-------------------------------|------|-----------------------------------|
| GET    | `/markets/:id/comments`       | No   | List comments on a market         |
| POST   | `/markets/:id/comments`       | Yes  | Post a comment                    |
| DELETE | `/comments/:id`               | Yes  | Delete own comment                |

---

## WebSocket Events

Connect to the WebSocket server at `ws://localhost:3001` using Socket.IO.

### Client → Server (emit)

| Event              | Payload                        | Description                            |
|--------------------|--------------------------------|----------------------------------------|
| `subscribe:market` | `{ marketId: string }`         | Subscribe to live updates for a market |
| `unsubscribe:market` | `{ marketId: string }`       | Stop receiving updates for a market    |

### Server → Client (on)

| Event               | Payload                                                           | Description                            |
|---------------------|-------------------------------------------------------------------|----------------------------------------|
| `price:update`      | `{ marketId, outcomes: [{ id, label, price }] }`                  | Live price tick every ~10 seconds      |
| `market:resolved`   | `{ id, question, outcome: 'YES' \| 'NO' }`                        | Fired when a market resolves           |
| `trade:executed`    | `{ marketId, outcomeId, price, amount, side }`                    | New trade on a subscribed market       |

### Example (browser)

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

socket.emit('subscribe:market', { marketId: 'clx...' });

socket.on('price:update', ({ marketId, outcomes }) => {
  console.log('New prices:', outcomes);
});

socket.on('market:resolved', ({ id, outcome }) => {
  console.log(`Market ${id} resolved as ${outcome}`);
});
```

---

## Database Setup

### Schema Overview

```
User
 ├─ trades (as buyer/seller)
 ├─ positions
 ├─ comments
 └─ leaderboard

Market
 ├─ outcomes (YES / NO)
 │   ├─ trades
 │   ├─ positions
 │   └─ priceHistory
 └─ comments

PriceHistory  (outcomeId, marketId, price, timestamp)
Trade         (buyerId, sellerId, marketId, outcomeId, price, amount)
Position      (userId, marketId, outcomeId, shares, avgPrice, pnl)
Leaderboard   (userId, totalPnl, totalTrades, winRate, rank)
Comment       (userId, marketId, content)
```

### Commands

```bash
# Apply all pending migrations
npx prisma migrate deploy

# Create and apply a new migration (dev only)
npx prisma migrate dev --name <migration_name>

# Reset database and re-seed (dev only — DESTRUCTIVE)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Seed the database
npx prisma db seed
```

The seed script (`prisma/seed.ts`) creates:
- **5 users** with realistic wallet addresses and usernames
- **30 markets** across categories: Crypto, Politics, Tech, Science, Sports, Finance, World Events, Entertainment
- **30 days of hourly price history** (~1,488 data points per outcome) with mean-reverting random walk
- **Sample trades, positions, leaderboard entries, and comments**

---

## Background Jobs

All jobs are powered by **BullMQ** backed by Redis and run as separate workers in the same process.

| Job Worker                  | Queue Name           | Interval   | Description                                              |
|-----------------------------|----------------------|------------|----------------------------------------------------------|
| `createPriceSimulationWorker` | `price-simulation` | 10 seconds | Random-walk price updates for all ACTIVE market outcomes |
| `createMarketResolutionWorker`| `market-resolution`| 1 minute   | Auto-resolves markets whose `resolutionDate` has passed  |
| `createLeaderboardWorker`    | `leaderboard-update` | 5 minutes  | Recalculates user rankings by PnL                        |
| `createPriceSnapshotWorker`  | `price-snapshot`    | 1 minute   | Records a `PriceHistory` row for every active outcome    |

Jobs are only started when `NODE_ENV !== 'test'`. Failed jobs are logged via pino and retained in Redis for inspection.

---

## Deployment

### Docker Compose (recommended)

```bash
# Copy and configure environment
cp .env.example .env
# Set JWT_SECRET, CORS_ORIGIN, POLYGON_RPC_URL, CONTRACT_ADDRESS

# Build and start all services
docker-compose up -d --build

# Run migrations inside the app container
docker-compose exec app npx prisma migrate deploy
docker-compose exec app npx prisma db seed

# View logs
docker-compose logs -f app
```

### Manual / Bare Metal

```bash
# Build TypeScript
npm run build

# Run migrations
npx prisma migrate deploy

# Start server
node dist/index.js
```

### Recommended Production Checklist

- [ ] Set a strong, random `JWT_SECRET` (≥ 64 chars)
- [ ] Use managed PostgreSQL (RDS, Supabase, Neon) with SSL
- [ ] Use managed Redis (Upstash, ElastiCache) or a Redis cluster
- [ ] Place the API behind an HTTPS reverse proxy (nginx, Caddy, or an ALB)
- [ ] Set `CORS_ORIGIN` to your exact frontend domain
- [ ] Enable PostgreSQL connection pooling via PgBouncer or Prisma Accelerate
- [ ] Set up log aggregation (e.g., Datadog, Loki, CloudWatch)
- [ ] Configure alerts on BullMQ `failed` job counts

### Environment-specific Docker Compose Override

```bash
# docker-compose.override.yml (not committed)
services:
  app:
    environment:
      - JWT_SECRET=your-actual-secret
      - CORS_ORIGIN=https://yourdomain.com
      - POLYGON_RPC_URL=https://your-rpc-endpoint
      - CONTRACT_ADDRESS=0xYourContractAddress
```

---

## Scripts

| Command              | Description                                  |
|----------------------|----------------------------------------------|
| `npm run dev`        | Start dev server with ts-node and hot reload  |
| `npm run build`      | Compile TypeScript to `dist/`                |
| `npm start`          | Run compiled production server               |
| `npm run typecheck`  | TypeScript type-check (no emit)              |
| `npm run lint`       | ESLint check                                 |
| `npx prisma studio`  | Open Prisma GUI                              |
| `npx prisma db seed` | Seed the database                            |

---

## License

MIT
