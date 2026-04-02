# Product

API Gateway Consumer Test Application — an R&D/testing app that demonstrates end-to-end integration with a platform API gateway.

## Purpose

Allows developers to test and validate the full integration flow:
1. User authenticates (signup/login) via the consumer backend
2. User initiates a service (e.g. PAN application, Driving Licence) through the frontend
3. Backend obtains an OAuth2 access token from the platform using client credentials
4. User is redirected to the platform's hosted form URL
5. User can check transaction status using a transaction ID

## Key Constraints

- This is intentionally minimal — no production features (rate limiting, HTTPS, logging frameworks, monitoring)
- Designed for local development and R&D testing only
- Valid platform API credentials (CLIENT_ID, CLIENT_SECRET, PLATFORM_BASE_URL) are required for the backend to function
