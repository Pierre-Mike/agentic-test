# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint `GET /test` to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint serves as a basic health check or test endpoint that can be used to validate the API is responding correctly.

## User Story
As a developer or monitoring system
I want to call a simple test endpoint
So that I can verify the API is responding correctly with minimal overhead

## Problem Statement
The application currently lacks a simple test endpoint that can be used for basic API validation, health checks, or automated testing workflows. This endpoint is needed to support the automated workflow validation process.

## Solution Statement
Implement a new `GET /test` endpoint in the Hono server that returns a JSON response with status 200 and body `{"test": "ok"}`. The endpoint will follow the existing patterns in the codebase, including proper typing with a shared TypeScript interface, comprehensive test coverage, and correct content-type headers.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono server file where routes are defined. We'll add the new `/test` endpoint here following the pattern of existing endpoints like `/hello` and `/version`.
- `server/src/index.test.ts` - Test file for server endpoints. We'll add comprehensive test coverage for the new endpoint following the pattern established for `/version`.
- `shared/src/types/index.ts` - Shared type definitions. We'll add a `TestResponse` type to maintain type safety between client and server.

### New Files
No new files are required. All changes will be made to existing files.

## Implementation Plan
### Phase 1: Foundation
Define the shared TypeScript type for the test endpoint response. This ensures type safety between the server implementation and any clients that consume this endpoint.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the existing patterns for route definition and JSON response handling.

### Phase 3: Integration
Add comprehensive test coverage to verify the endpoint works correctly and meets all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared types
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type that defines the structure `{ test: string }`
- Export the type so it can be used in both server and tests

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new describe block for `/test endpoint`
- Write test: "should return status 200"
- Write test: "should return JSON with correct structure { test: 'ok' }"
- Write test: "should have application/json content-type"
- Follow the exact pattern used for the `/version` endpoint tests

### Step 3: Implement /test endpoint
- Open `server/src/index.ts`
- Import the `TestResponse` type from shared
- Add a new `.get("/test", ...)` route following the chained pattern
- Return `c.json({ test: "ok" }, { status: 200 })` with proper typing
- Place the endpoint logically with the other simple endpoints

### Step 4: Run validation commands
- Execute `bun run test` to verify all tests pass with zero regressions
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to verify type safety across all workspaces

## Testing Strategy
### E2E Tests
No separate e2e tests are needed as the unit tests will fully validate the endpoint behavior using Hono's built-in request testing capability (`app.request()`), which tests the full request/response cycle.

### Unit Tests
Test the `/test` endpoint with the following unit tests:
1. **Status code test**: Verify the endpoint returns HTTP 200
2. **Response structure test**: Verify the response JSON has the exact structure `{ test: "ok" }`
3. **Content-type test**: Verify the response has `application/json` content-type header

### Integration Tests
The unit tests using `app.request()` effectively serve as integration tests since they test the full Hono middleware stack (CORS, routing, JSON serialization).

### Edge Cases
- Verify the endpoint works without any query parameters
- Verify the endpoint only responds to GET method
- Verify the response is valid JSON
- Verify type safety is maintained when consuming the response

## Acceptance Criteria
- `GET /test` endpoint exists and is accessible
- Endpoint returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is `application/json`
- TypeScript types are properly defined and shared
- All tests pass with 100% coverage for the new endpoint
- No regressions in existing tests
- Code follows existing patterns and conventions in the codebase

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces

## Notes
- This is a simple feature that follows well-established patterns in the codebase
- No new dependencies are required
- The endpoint is intentionally simple for use in automated testing workflows
- The implementation maintains the monorepo's focus on type safety and shared definitions
- This endpoint can be used for health checks, smoke tests, or workflow validation
