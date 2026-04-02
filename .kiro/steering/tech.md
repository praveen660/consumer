# Tech Stack

## Backend (`consumer-backend`)

- **Runtime**: Node.js 18+
- **Framework**: NestJS 10
- **Language**: TypeScript 5
- **Database**: MongoDB via Mongoose 8
- **Auth**: Passport.js + `@nestjs/jwt` (JWT, 24h expiry) + bcryptjs for password hashing
- **HTTP Client**: Axios via `@nestjs/axios`
- **Config**: `@nestjs/config` (reads `.env`)
- **Build tool**: NestJS CLI (`nest build`)
- **Test framework**: Jest + ts-jest (test files match `*.spec.ts`)

## Frontend (`consumer-frontend`)

- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript 5
- **React**: 19
- **Styling**: Tailwind CSS 4.x (use `bg-linear-to-r` not `bg-gradient-to-r`, `shrink-0` not `flex-shrink-0`)
- **Icons**: lucide-react
- **HTTP Client**: Native Fetch API
- **Test framework**: Jest 30 + React Testing Library + `fast-check` for property-based tests (PBT)
- **Test files**: `*.test.tsx` (unit), `*.pbt.test.tsx` (property-based)

## Ports

| Service  | Port |
|----------|------|
| Backend  | 5001 (env: `PORT`) |
| Frontend | 4000 |

CORS is configured on the backend to allow `http://localhost:4000`.

## Environment Variables

### Backend (`.env`)
```
PLATFORM_BASE_URL=
CLIENT_ID=
CLIENT_SECRET=
PORT=5001
JWT_SECRET=
MONGODB_URI=
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_BACKEND_URL=http://localhost:4001
```

## Common Commands

### Backend
```bash
cd consumer-backend
npm run start:dev     # dev server with hot reload
npm run build         # compile to dist/
npm run start:prod    # run compiled build
npm run test          # run Jest tests (*.spec.ts)
npm run test:cov      # with coverage
npm run lint          # ESLint + Prettier fix
```

### Frontend
```bash
cd consumer-frontend
npm run dev           # Next.js dev server on port 4000
npm run build         # production build
npm run lint          # Next.js ESLint
npm run test          # Jest (single run)
npm run test:watch    # Jest watch mode
```
