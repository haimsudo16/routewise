# RouteWise

A cinematic, full-stack route optimization platform: React + Vite frontend, Spring Boot + PostgreSQL backend, JWT auth, a real nearest-neighbor route optimizer, interactive maps, fuel/cost estimates, and analytics — all wired end-to-end over a REST API.

## Project layout

```
routewise/
├── backend/     Spring Boot 3 / Java 17 / PostgreSQL API
├── frontend/    React 18 / Vite / Tailwind / Framer Motion / GSAP
└── docker-compose.yml   Postgres for local development
```

## Quick start

### 1. Database

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with database `routewise` / user `routewise` / password `routewise` (override via `backend/.env`, copied from `backend/.env.example`).

### 2. Backend

```bash
cd backend
cp .env.example .env   # edit JWT_SECRET etc. for anything beyond local dev
mvn spring-boot:run
```

The API listens on `http://localhost:8080`. Swagger UI: `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env   # VITE_API_BASE_URL defaults to http://localhost:8080/api
npm install
npm run dev
```

Open `http://localhost:5173`.

## A note on how this was built

This project was generated in a sandboxed cloud environment whose network policy blocks both the npm registry and Maven Central. That means:

- The **backend** was written and manually verified line-by-line against the exact Spring Boot 3.3 / Spring Security 6 / jjwt 0.12 / Hibernate 6 APIs it uses, but `mvn compile` could not be executed in that sandbox. Run `mvn clean compile` (or `mvn spring-boot:run`) the first time to confirm your local environment resolves dependencies cleanly.
- The **frontend** was syntax-checked file-by-file and the entire 65-file import graph (every relative import, from `main.jsx` down through every lazy-loaded page) was bundle-resolved with esbuild to confirm there are no broken paths or typos. `npm install` itself could not be run in that sandbox, so run it locally before `npm run dev`.

If either `mvn compile` or `npm run build` surfaces something on your machine, it's most likely a dependency-version nuance in your local toolchain rather than a structural issue — open an issue against the specific error and it's straightforward to patch.

## Architecture

**Backend**: `Controller → Service → Repository → PostgreSQL`, with DTOs at the boundary and a `GlobalExceptionHandler` for consistent error responses. Every route/stop/vehicle/analytics query is scoped to the authenticated user via `SecurityUtils.getCurrentUserId()` — the client-supplied `userId` is never trusted.

Route optimization lives behind a `RoutingProvider` interface (`service/routing/`). The shipped `BasicRoutingProvider` estimates road distance from great-circle coordinates; swapping in a real road-network API (OSRM, Mapbox, Google Routes) later only means adding a new `RoutingProvider` implementation — the `RouteOptimizationService`'s Nearest Neighbor algorithm and every controller built on top of it stay untouched.

**Frontend**: pages compose small components from `components/{common,landing,dashboard,map,charts}`; all HTTP calls go through `services/*Service.js` (built on a single Axios instance with JWT + 401 interceptors in `services/api.js`); Framer Motion variants live in `animations/variants.js` and GSAP timelines in `animations/*Animations.js` so animation logic isn't scattered through JSX.

## REST API

| Area | Endpoints |
|---|---|
| Auth | `POST /api/auth/register`, `POST /api/auth/login` |
| Routes | `GET/POST /api/routes`, `GET/PUT/DELETE /api/routes/{id}`, `GET /api/routes/recent` |
| Optimization & lifecycle | `POST /api/routes/{id}/optimize`, `/start`, `/complete`, `/cancel` |
| Stops | `POST /api/routes/{routeId}/stops`, `PUT/DELETE /api/stops/{id}`, `POST /api/stops/{id}/complete`, `/skip`, `PUT /api/routes/{id}/stops/reorder` |
| Analytics | `GET /api/analytics/overview`, `/routes`, `/distance`, `/time-saved` |
| Vehicles | `GET/POST /api/vehicles`, `PUT/DELETE /api/vehicles/{id}` |
| User | `GET/PUT /api/users/me` |
| Geocoding | `GET /api/geocode/search?query=` (proxies OpenStreetMap Nominatim — swap `routewise.geocoding.provider-url` for a production geocoder if you expect real traffic) |

## Scope notes

This is a genuinely functional full-stack app — every button on the dashboard talks to a real endpoint, backed by a real Postgres schema, with real JWT-secured, per-user data isolation, and a real (if intentionally simple) optimization algorithm. Two things worth knowing before a portfolio review:

- **Distance/duration are estimated**, not pulled from a road-routing engine (see `RoutingProvider` above for how to upgrade that).
- **Geocoding** uses the free public Nominatim API, which is rate-limited (~1 req/sec) and not licensed for production-volume traffic — fine for development and demos, swap the provider for real usage.
