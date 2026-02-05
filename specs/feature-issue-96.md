# Feature: Add /test endpoint

## Feature Description
Add a simple GET /test endpoint to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint will be used for automated workflow testing and validation of the deployment pipeline.

## User Story
As a developer
I want a simple test endpoint
So that I can verify the server is running correctly and the deployment pipeline is functioning

## Problem Statement
The application currently lacks a simple endpoint that can be used to validate that the server is operational and responding correctly. This is needed for automated workflow testing and health checks.

## Solution Statement
Implement a new GET /test endpoint in the Hono server that returns a JSON response with the structure `{"test": "ok"}` and a 200 status code. The endpoint will follow the existing pattern used in the codebase for JSON endpoints.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main server file where the new endpoint will be added, following the pattern of existing endpoints like `/hello` and `/version`
- `server/src/index.test.ts` - Unit tests for server endpoints, where tests for the new /test endpoint will be added
- `shared/src/types/index.ts` - Type definitions shared between client and server, where the TestResponse type will be defined
- `e2e/tests/` - E2E test directory where integration tests will be added

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New Playwright test file for end-to-end testing of the /test endpoint

## Implementation Plan
### Phase 1: Foundation
Create the shared TypeScript type definition for the test endpoint response. This ensures type safety between the server implementation and any client code that might consume this endpoint.

### Phase 2: Core Implementation
Add the GET /test endpoint to the Hono server following the existing architectural patterns. The endpoint will return a JSON response with the structure `{"test": "ok"}` and use the newly defined TestResponse type.

### Phase 3: Integration
Add comprehensive test coverage including unit tests and end-to-end tests to ensure the endpoint works correctly and meets all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared types
- Open `shared/src/types/index.ts`
- Add a new exported type: `TestResponse` with a single property `test` of type string
- This type will be used by the server endpoint and can be imported by any client code

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new describe block for the `/test endpoint`
- Test 1: Verify the endpoint returns status 200
- Test 2: Verify the response has correct JSON structure with `test` property
- Test 3: Verify the response body is exactly `{"test": "ok"}`
- Test 4: Verify the content-type header is `application/json`

### Step 3: Implement /test endpoint in server
- Open `server/src/index.ts`
- Import the `TestResponse` type from shared
- Add a new `.get("/test", ...)` route handler following the pattern of existing routes
- Return `c.json({ test: "ok" }, { status: 200 })`
- Ensure proper typing with `TestResponse`

### Step 4: Write E2E tests for /test endpoint
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Add Playwright tests to verify the endpoint is accessible via HTTP
- Test 1: Verify GET request to /test returns 200 status
- Test 2: Verify response content-type is application/json
- Test 3: Verify response body matches `{"test": "ok"}`

### Step 5: Run validation commands
- Run `bun run test` to verify all unit tests pass
- Run `bun run build` to ensure no compilation errors
- Run `bun run type-check` to verify type safety across all workspaces
- Run e2e tests to verify end-to-end functionality

## Testing Strategy
### E2E Tests
- Create `e2e/tests/test-endpoint.spec.ts` to test the endpoint via HTTP requests
- Verify the endpoint is accessible when the server is running
- Verify the response status code is 200
- Verify the response has the correct content-type header (application/json)
- Verify the response body structure matches the acceptance criteria exactly

### Unit Tests
- Add tests to `server/src/index.test.ts` following the existing pattern for `/version` endpoint tests
- Test that the endpoint returns status 200
- Test that the response has the correct JSON structure
- Test that the response body contains `{"test": "ok"}`
- Test that the content-type header is application/json

### Integration Tests
The e2e tests serve as integration tests, verifying that:
- The endpoint is properly registered in the Hono app
- The server correctly handles HTTP requests to /test
- The response is properly formatted and sent back to the client

### Edge Cases
- Test with various HTTP clients (curl, fetch, axios) to ensure compatibility
- Verify the endpoint works with CORS enabled (existing middleware)
- Ensure the endpoint doesn't accept other HTTP methods (POST, PUT, DELETE, etc.)

## Acceptance Criteria
- GET /test endpoint exists and is accessible
- Endpoint returns HTTP status code 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is `application/json`
- Unit tests pass with 100% coverage for the new endpoint
- E2E tests pass and verify the endpoint works end-to-end
- No TypeScript compilation errors
- No existing tests are broken
- Code follows existing patterns and conventions in the codebase

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `bun run test:e2e` - Run Playwright e2e tests to verify end-to-end functionality
- `curl http://localhost:8787/test` - Manual verification that the endpoint returns `{"test":"ok"}`

## Notes
- This is a simple endpoint designed for automated workflow testing
- The endpoint follows the existing architectural patterns in the codebase (using Hono's `.get()` method and returning JSON with `c.json()`)
- No new dependencies are required
- The endpoint does not require authentication or any special configuration
- This endpoint is intentionally simple and will be used primarily for CI/CD validation and health checks
- The TestResponse type is defined in the shared package for consistency with other endpoints, even though this is a simple response
