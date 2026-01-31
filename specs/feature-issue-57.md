# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint `GET /test` to the Hono server that returns a JSON response `{"test": "ok"}` with HTTP status 200. This endpoint will be used for automated workflow validation and health checking purposes.

## User Story
As a developer or automated system
I want to query the `/test` endpoint
So that I can validate the server is operational and responding correctly with a predictable JSON response

## Problem Statement
The current server lacks a dedicated test endpoint that can be used for automated workflow validation, health checks, or integration testing. This makes it difficult to verify the server is running and responding correctly in automated environments.

## Solution Statement
Implement a new `GET /test` endpoint in the Hono server following existing patterns. The endpoint will return a typed JSON response `{"test": "ok"}` with HTTP status 200 and proper content-type headers. This will be fully type-safe using shared types between client and server.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main server file where the `/test` endpoint will be added, following the pattern of existing endpoints like `/hello` and `/version`
- `server/src/index.test.ts` - Unit tests file where tests for the `/test` endpoint will be added, following the existing test pattern for `/version`
- `shared/src/types/index.ts` - Shared type definitions where the `TestResponse` type will be defined

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New E2E test file to validate the `/test` endpoint works correctly in a full application context

## Implementation Plan
### Phase 1: Foundation
Define the shared TypeScript type for the test endpoint response to ensure type safety across client and server. This follows the existing pattern used for `ApiResponse` and `VersionResponse`.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the established patterns for existing endpoints. The endpoint will use the new shared type and return the correct JSON response with appropriate HTTP status.

### Phase 3: Integration
Add comprehensive test coverage including unit tests and E2E tests to ensure the endpoint works correctly and meets all acceptance criteria. Validate the implementation with zero regressions.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Define shared type for test response
- Open `shared/src/types/index.ts`
- Add `TestResponse` type definition following the pattern of existing types:
  ```typescript
  export type TestResponse = {
    test: string;
  };
  ```

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new describe block for "/test endpoint" following the pattern of "/version endpoint"
- Add test cases:
  - Test that the endpoint returns status 200
  - Test that the response has correct JSON structure with `test` property
  - Test that the `test` property equals "ok"
  - Test that content-type is application/json

### Step 3: Write E2E test for /test endpoint
- Create `e2e/tests/test-endpoint.spec.ts`
- Add E2E test to verify the endpoint works in a full application context
- Test that a GET request to the server `/test` endpoint returns the expected response

### Step 4: Implement /test endpoint
- Open `server/src/index.ts`
- Import `TestResponse` type from shared
- Add `.get("/test")` route following the pattern of existing routes
- Return `c.json({ test: "ok" }, { status: 200 })` with proper typing

### Step 5: Validate implementation
- Run all validation commands to ensure the feature works with zero regressions
- Fix any issues that arise
- Ensure all tests pass

## Testing Strategy
### E2E Tests
- **Full stack test**: Create a Playwright test that makes an HTTP request to the running server's `/test` endpoint and validates:
  - HTTP status is 200
  - Response body is `{"test": "ok"}`
  - Content-type header is `application/json`

### Unit Tests
- **Status code test**: Verify the endpoint returns HTTP 200
- **Response structure test**: Verify the response has the `test` property
- **Response value test**: Verify `test` property equals "ok"
- **Content-type test**: Verify the response has `application/json` content-type header
- **Type safety test**: Verify the response conforms to `TestResponse` type

### Integration Tests
No separate integration tests are needed as the E2E tests cover integration between client and server.

### Edge Cases
- Test that the endpoint works without any query parameters
- Test that the endpoint works when accessed multiple times
- Verify the endpoint doesn't require authentication or special headers

## Acceptance Criteria
- `GET /test` endpoint exists and is accessible
- Endpoint returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is `application/json`
- All unit tests pass
- All E2E tests pass
- No build errors or type errors
- No regressions in existing functionality

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests including new unit tests for `/test` endpoint
- `cd e2e && bun run test` - Run E2E tests including new test-endpoint.spec.ts
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `curl http://localhost:8787/test` - Manual test to verify endpoint returns correct response (after starting dev server)

## Notes
- This endpoint follows the same pattern as existing endpoints (`/hello`, `/version`)
- The endpoint uses shared types for type safety across the monorepo
- The implementation is intentionally simple as this is a test/validation endpoint
- The endpoint requires no authentication or special configuration
- Future considerations: This endpoint could be extended with additional test data or health check information if needed
