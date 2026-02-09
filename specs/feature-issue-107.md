# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint to the server that returns a JSON response containing `{"test": "ok"}`. This endpoint will serve as a basic health check or test endpoint for automated testing and validation purposes.

## User Story
As a developer or automated test system
I want to call a simple test endpoint
So that I can verify the server is responding correctly with a known JSON response

## Problem Statement
The application needs a simple, predictable test endpoint that can be used for automated workflow testing and validation. Currently, there is no dedicated test endpoint that returns a minimal, predictable response.

## Solution Statement
Create a new GET endpoint at `/test` that returns a JSON response with the structure `{"test": "ok"}` with a 200 status code and proper `application/json` content-type header. This endpoint will follow the existing patterns established by other endpoints like `/version` and `/hello`.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main server file where all routes are defined. This is where the new `/test` endpoint will be added.
- **server/src/index.test.ts** - Unit tests for server endpoints. Tests for the new `/test` endpoint will be added here.
- **shared/src/types/index.ts** - Shared type definitions. A new `TestResponse` type will be added here for type safety.
- **e2e/tests/** - End-to-end tests directory where integration tests will be added.

### New Files
- **e2e/tests/test-endpoint.spec.ts** - New Playwright test file to verify the `/test` endpoint works correctly in the full application context.

## Implementation Plan
### Phase 1: Foundation
Define the TypeScript type for the test endpoint response in the shared package to ensure type safety between client and server. This follows the existing pattern used by `ApiResponse` and `VersionResponse`.

### Phase 2: Core Implementation
Add the `/test` endpoint to the Hono server following the existing route definition patterns. The endpoint will return a JSON response with the correct status code and content-type header.

### Phase 3: Integration
Validate the endpoint works correctly through comprehensive unit tests and end-to-end tests to ensure it meets all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type that matches the response structure `{"test": "ok"}`
- Export the new type so it can be imported by both server and client

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new test suite using `describe()` for the `/test` endpoint
- Write test cases to verify:
  - Status code is 200
  - Response body has the correct structure `{"test": "ok"}`
  - Content-Type header is `application/json`
  - Response matches the `TestResponse` type

### Step 3: Implement /test endpoint
- Open `server/src/index.ts`
- Import the `TestResponse` type from shared package
- Add a new `.get("/test", ...)` route handler after the existing endpoints
- Return `c.json()` with the test data object `{"test": "ok"}` and status 200
- Ensure the response is properly typed as `TestResponse`

### Step 4: Write e2e tests for /test endpoint
- Create a new file `e2e/tests/test-endpoint.spec.ts`
- Add Playwright tests that:
  - Make a GET request to `/test` endpoint
  - Verify status code is 200
  - Verify response body is `{"test": "ok"}`
  - Verify content-type is `application/json`

### Step 5: Run validation commands
- Run `bun run test` to ensure all unit tests pass
- Run `bun run build` to ensure no compilation errors
- Run `bun run type-check` to ensure type safety across the monorepo
- Run `bun run test:e2e` to ensure end-to-end tests pass

## Testing Strategy
### E2E Tests
Create a new Playwright test file `e2e/tests/test-endpoint.spec.ts` that:
- Tests the `/test` endpoint from a real browser/HTTP client perspective
- Verifies the response status is 200
- Verifies the response body exactly matches `{"test": "ok"}`
- Verifies the content-type header is `application/json`
- Ensures the endpoint is accessible and returns the correct data

### Unit Tests
Add comprehensive unit tests in `server/src/index.test.ts`:
- Test that the endpoint returns status 200
- Test that the response JSON structure matches `TestResponse` type
- Test that the response contains the exact values `{"test": "ok"}`
- Test that the content-type header is `application/json`
- Follow the same testing pattern used for the `/version` endpoint

### Integration Tests
The e2e tests serve as integration tests by verifying the endpoint works in the full application context with all middleware (CORS, etc.) applied.

### Edge Cases
- Verify endpoint works with CORS enabled (follows existing pattern)
- Verify endpoint returns consistent response on multiple requests
- Verify content-type header is properly set

## Acceptance Criteria
- GET `/test` endpoint exists and is accessible
- Endpoint returns HTTP status code 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is `application/json`
- Response is properly typed using the `TestResponse` type from shared package
- All unit tests pass with no errors
- All e2e tests pass with no errors
- No compilation or type errors in the monorepo

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `bun run test:e2e` - Run end-to-end tests to validate the endpoint in full application context

## Notes
- This endpoint follows the same pattern as existing endpoints (`/hello`, `/version`)
- The response structure is intentionally simple for easy automated testing
- The endpoint does not require any environment variables or external dependencies
- This is part of an automated workflow test and will be cleaned up after validation
- Future consideration: This endpoint could be extended with additional test parameters or health check information if needed
