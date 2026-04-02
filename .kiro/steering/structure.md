# Project Structure

Monorepo with two independent apps — no shared packages.

```
/
├── consumer-backend/          # NestJS API server
│   └── src/
│       ├── app.module.ts      # Root module — registers ConfigModule, MongooseModule, HttpModule, AuthModule, FormModule
│       ├── app.controller.ts  # Root controller (health/misc endpoints)
│       ├── main.ts            # Bootstrap — CORS, port config
│       ├── auth/              # Auth feature module
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts   # POST /auth/signup, POST /auth/login
│       │   ├── auth.service.ts      # signup, login, getAccessToken (OAuth2 client credentials)
│       │   ├── auth.guard.ts        # JWT auth guard
│       │   ├── jwt.strategy.ts      # Passport JWT strategy
│       │   └── schemas/
│       │       └── user.schema.ts   # Mongoose User schema (email, password)
│       └── form/              # Form feature module
│           ├── form.module.ts
│           └── form.service.ts      # Form initiation + transaction status via platform API
│
└── consumer-frontend/         # Next.js App Router frontend
    ├── app/                   # Next.js App Router pages
    │   ├── layout.tsx
    │   ├── page.tsx           # Home — renders ServiceGrid
    │   ├── login/page.tsx     # Auth page — renders AuthScreen
    │   └── status/page.tsx    # Transaction status page
    ├── components/            # Client components ('use client')
    │   ├── AuthScreen.tsx          # Login/signup form with tab navigation
    │   ├── AuthScreen.test.tsx     # Unit tests
    │   ├── AuthScreen.pbt.test.tsx # Property-based tests (fast-check)
    │   ├── ServiceCard.tsx         # Individual service card with initiate button
    │   ├── ServiceGrid.tsx         # Grid of ServiceCards
    │   ├── FormInitiator.tsx       # Handles form initiation flow
    │   └── StatusChecker.tsx       # Transaction status lookup UI
    ├── lib/
    │   ├── api.ts             # All fetch calls to backend; stores JWT in localStorage
    │   └── serviceConfig.ts   # SERVICES array (id, name, description, icon, endpoint, enabled)
    └── types/
        └── service.ts         # ServiceMetadata, ServiceCardProps, ServiceGridProps interfaces
```

## Architecture Patterns

- **Backend**: Standard NestJS feature modules. Each feature has its own module, controller, and service. Guards are applied per-route via decorators.
- **Frontend**: Next.js App Router. Pages are server components by default; interactive components use `'use client'`. All API calls are centralised in `lib/api.ts`.
- **Auth flow**: JWT issued by backend on login/signup → stored in `localStorage` → sent as `Authorization: Bearer <token>` header on protected requests.
- **Platform OAuth2**: Backend fetches a client-credentials token from `PLATFORM_BASE_URL/v1/oauth/token` before proxying requests to the platform API.
- **Service config**: New services are added to the `SERVICES` array in `lib/serviceConfig.ts` — no other files need changing to add a card to the home page.
- **Testing**: Unit tests use React Testing Library. Property-based tests use `fast-check` and live in `*.pbt.test.tsx` files alongside the component.
