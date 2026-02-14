# Feature: Add /test endpoint returning {test: "ok"}

## Feature Description
Add a simple test endpoint to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint serves as a basic health check and validation endpoint that can be used to verify the server is responding correctly to API requests. The endpoint will follow the existing patterns in the codebase and include proper type safety, testing, and documentation.

## User Story
As a developer or monitoring system
I want to call a simple test endpoint
So that I can quickly verify the API is operational and responding correctly

## Problem Statement
The application currently lacks a simple, dedicated test endpoint that can be used for basic health checks, automated testing, and validation. While the root `/` and `/hello` endpoints exist, there is no standardized `/test` endpoint that returns a predictable response format for automated workflows and validation scripts.

## Solution Statement
Add a new `GET /test` endpoint to the Hono server that returns a JSON response with status 200 and body `{"test": "ok"}`. The implementation will follow existing patterns in the codebase including:
- Chainable route registration in `/server/src/index.ts`
- Proper TypeScript typing with a shared type definition
- Comprehensive unit tests using Bun's test framework
- E2E tests using Playwright
- CORS support (inherited from existing middleware)

## Relevant Files
Use these files to implement the feature:

- `/server/src/index.ts` (lines 10-38) - Main Hono app definition where all endpoints are registered. This is where the new `/test` endpoint will be added following the existing pattern of `.get()` route registration.

- `/server/src/index.test.ts` (entire file) - Test file using Bun's test framework. New unit tests for the `/test` endpoint will be added here following the existing pattern used for the `/version` endpoint tests.

- `/shared/src/types/index.ts` (lines 1-11) - Shared TypeScript type definitions used across server and client. A new `TestResponse` type will be added here to ensure type safety.

- `/server/src/client.ts` (lines 1-3) - Typed Hono client wrapper that provides RPC-style type-safe API calls. Will automatically include the new endpoint in its type definitions once added to the server app.

### New Files
- `/e2e/tests/test-endpoint.spec.ts` - New Playwright e2e test file specifically for the `/test` endpoint, following the pattern of existing e2e tests in the `e2e/tests/` directory.

## Implementation Plan
### Phase 1: Foundation
Define the shared TypeScript type for the test response to ensure type safety across the server and client. This follows the existing pattern where response types are defined in the `shared` package and imported by both server and client workspaces.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the existing route registration pattern. The endpoint will use the new `TestResponse` type and return the required JSON structure with proper status codes.

### Phase 3: Integration
Add comprehensive testing at both the unit level (Bun tests) and e2e level (Playwright tests) to validate the endpoint works correctly. Run all validation commands to ensure zero regressions across the entire codebase.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared types
- Open `/shared/src/types/index.ts`
- Add a new `TestResponse` interface following the pattern of existing response types
- Export the new type so it can be used by server and client packages
- The type should define the structure: `{ test: string }`

### Step 2: Write unit tests for /test endpoint
- Open `/server/src/index.test.ts`
- Add a new `describe` block for "/test endpoint"
- Write the following unit tests following the existing pattern from "/version endpoint" tests:
  - Test that the endpoint returns status 200
  - Test that the response has correct JSON structure with `test` property
  - Test that the `test` property has value "ok"
  - Test that the content-type header is "application/json"
- Use `app.request("/test")` to make test requests
- Use proper TypeScript typing with `TestResponse` type

### Step 3: Write e2e tests for /test endpoint
- Create new file `/e2e/tests/test-endpoint.spec.ts`
- Import Playwright test utilities (`test`, `expect`)
- Create a test suite that:
  - Makes a GET request to the `/test` endpoint via the running server
  - Validates the response status is 200
  - Validates the response body matches `{"test": "ok"}`
  - Validates the content-type header is application/json
- Follow the pattern used in existing e2e tests like `homepage.spec.ts`

### Step 4: Implement the /test endpoint
- Open `/server/src/index.ts`
- Add a new `.get("/test")` route in the chain after the existing routes
- The handler should return `c.json({ test: "ok" })`
- Add proper TypeScript typing using the `TestResponse` type from shared
- Follow the exact pattern used by the `/version` endpoint implementation

### Step 5: Run validation commands
- Execute `bun run test` to run all unit tests and verify no regressions
- Execute `bun run build` to build all workspaces and ensure no compilation errors
- Execute `bun run type-check` to validate TypeScript types across all packages
- Execute `bun run e2e` to run all Playwright e2e tests
- Verify all commands complete successfully with no errors

## Testing Strategy
### E2E Tests
Create a dedicated e2e test file (`/e2e/tests/test-endpoint.spec.ts`) that validates the full user flow:
- Test makes an HTTP GET request to the running server at `GET /test`
- Response status code is 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is `application/json`
- This validates the endpoint works in a real browser/network environment

### Unit Tests
Add unit tests in `/server/src/index.test.ts` using Bun's test framework:
- Test the endpoint returns status 200
- Test the response JSON structure is correct and includes the `test` property
- Test the `test` property value is exactly "ok"
- Test the content-type header is set to "application/json"
- These tests use Hono's built-in request testing without needing a running server

### Integration Tests
The e2e tests serve as integration tests, validating the endpoint works with:
- The Hono server runtime
- CORS middleware (already applied to all routes)
- JSON serialization
- HTTP protocol handling
- Type safety across the server-client boundary via the typed client

### Edge Cases
- Verify the endpoint works without any query parameters
- Verify the endpoint only responds to GET requests (not POST, PUT, DELETE, etc.)
- Verify the response is consistent across multiple requests
- Verify the endpoint works with the existing CORS configuration
- Verify the endpoint doesn't require environment bindings (unlike `/version` which reads env vars)

## Acceptance Criteria
- `GET /test` endpoint exists and returns HTTP status 200
- Response body is exactly `{"test": "ok"}` in valid JSON format
- Response content-type header is `application/json` (or contains it)
- Unit tests pass for the endpoint covering all test cases
- E2E tests pass validating the endpoint in a real runtime environment
- All existing tests continue to pass (zero regressions)
- TypeScript compilation succeeds with no errors across all workspaces
- Type checking passes with no errors
- The `TestResponse` type is properly defined in shared types
- The endpoint follows existing code patterns and conventions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests across all workspaces to validate the feature works with zero regressions
- `bun run build` - Build all workspaces (client, server, shared, e2e) to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure TypeScript types are valid
- `bun run e2e` - Run all Playwright e2e tests to validate the endpoint in a real environment
- `curl http://localhost:8787/test` - Manual curl test to verify the endpoint returns the expected response (run this during local dev testing)

## Notes
- This is a test endpoint for automated workflow validation and will be cleaned up after validation
- The endpoint is intentionally simple with no authentication, rate limiting, or complex logic
- Future considerations: This pattern could be extended for more sophisticated health check endpoints that validate database connections, external service availability, etc.
- The endpoint inherits CORS support from the existing `cors()` middleware applied to the entire Hono app
- No new dependencies are required - all necessary libraries (hono, bun, playwright) are already in the project
- The typed Hono client will automatically gain type-safe access to this endpoint once it's added to the server app
