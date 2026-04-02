# API Gateway Consumer Test Application

A minimal consumer test application demonstrating integration with an API gateway form service. This R&D testing application consists of a NestJS backend and Next.js 16+ frontend with App Router, implementing OAuth2 authentication, form initiation, and transaction status checking.

**Key Technologies:**
- Backend: NestJS with @nestjs/axios for HTTP requests
- Frontend: Next.js 16+ with App Router architecture (Server and Client Components)
- HTTP Client: Native Fetch API (frontend), Axios (backend)
- Styling: Tailwind CSS 4.x

## Project Overview

This application demonstrates the complete integration flow:
1. **OAuth2 Authentication** - Backend authenticates with the platform using client credentials
2. **Form Initiation** - User initiates a PAN application form through the frontend
3. **Form Completion** - User is redirected to the platform's form URL to complete the form
4. **Status Checking** - User can query transaction status using the transaction ID

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│  User Browser   │─────▶│ Consumer        │─────▶│ Platform API    │
│                 │      │ Frontend        │      │ Gateway         │
│                 │      │ (Next.js)       │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │ Consumer        │
                         │ Backend         │
                         │ (NestJS)        │
                         └─────────────────┘
```

## Project Structure

```
.
├── consumer-backend/     # NestJS backend application
│   ├── src/
│   │   ├── auth/        # OAuth2 authentication service
│   │   ├── form/        # Form initiation and status services
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env.example
│   └── package.json
│
├── consumer-frontend/    # Next.js frontend application
│   ├── pages/
│   │   ├── index.tsx    # Home page with form initiation
│   │   └── status.tsx   # Transaction status page
│   ├── services/
│   │   └── api.ts       # API service for backend communication
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Access to a Platform API Gateway instance with valid credentials

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `consumer-backend/` directory with the following variables:

```env
# Platform API Gateway base URL
PLATFORM_BASE_URL=https://api.platform.example.com

# OAuth2 client credentials
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# Backend server port (default: 3001)
PORT=3001
```

### Frontend Environment Variables

Create a `.env.local` file in the `consumer-frontend/` directory with the following variable:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Installation

### Backend Installation

```bash
cd consumer-backend
npm install
```

### Frontend Installation

```bash
cd consumer-frontend
npm install
```

## Running the Application

### Start the Backend

```bash
cd consumer-backend
npm run start:dev
```

The backend will start on **http://localhost:3001** (or the port specified in your `.env` file).

### Start the Frontend

```bash
cd consumer-frontend
npm run dev
```

The frontend will start on **http://localhost:3000**.

## Default Ports

- **Backend**: 3001
- **Frontend**: 3000

## API Endpoints

### Backend Endpoints

- `GET /api/start-form` - Initiates a form session and returns form URL and transaction ID
- `GET /api/transaction/:id` - Retrieves transaction status for a given transaction ID

### Platform API Endpoints (configured via PLATFORM_BASE_URL)

- `POST /oauth/token` - OAuth2 token endpoint
- `POST /forms/initiate` - Form initiation endpoint
- `GET /forms/transactions/:id` - Transaction status endpoint

## Usage

### Starting a PAN Application

1. Open your browser to http://localhost:3000
2. Click the "Start PAN Application" button
3. You will be redirected to the platform's form URL
4. Complete the form on the platform
5. Note the transaction ID for status checking

### Checking Transaction Status

1. Navigate to http://localhost:3000/status
2. Enter your transaction ID
3. Click "Check Status"
4. View the transaction status information

## Development

### Backend Development

```bash
cd consumer-backend

# Run in development mode with hot reload
npm run start:dev

# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Build for production
npm run build

# Run production build
npm run start:prod
```

### Frontend Development

```bash
cd consumer-frontend

# Run in development mode with hot reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run linter
npm run lint
```

## Testing

### Backend Tests

```bash
cd consumer-backend
npm run test
```

### Frontend Tests

```bash
cd consumer-frontend
npm run test
```

## Configuration Example

### Complete Backend .env Example

```env
PLATFORM_BASE_URL=https://api.platform.example.com
CLIENT_ID=consumer_client_id
CLIENT_SECRET=consumer_client_secret
PORT=3001
```

### Complete Frontend .env.local Example

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

## Important Notes

- This is an R&D testing application and intentionally excludes production features
- No token caching, rate limiting, or complex error handling is implemented
- No HTTPS, logging frameworks, or monitoring is included
- Designed for local development and testing purposes only
- Ensure the backend is running before starting the frontend
- Make sure to configure valid Platform API credentials in the backend `.env` file

## Troubleshooting

### Backend won't start
- Verify all environment variables are set in `.env`
- Check that port 3001 is not already in use
- Ensure Node.js version is 18.x or higher

### Frontend won't connect to backend
- Verify the backend is running on the correct port
- Check that `NEXT_PUBLIC_BACKEND_URL` in `.env.local` matches the backend URL
- Ensure CORS is properly configured in the backend

### OAuth authentication fails
- Verify `CLIENT_ID` and `CLIENT_SECRET` are correct
- Check that `PLATFORM_BASE_URL` is accessible
- Ensure the Platform API Gateway is running and accessible

### Form initiation fails
- Verify OAuth authentication is working
- Check backend logs for error messages
- Ensure the Platform API Gateway form initiation endpoint is accessible

## License

MIT
