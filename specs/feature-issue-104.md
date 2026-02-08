# Feature: Add /test endpoint

## Feature Description
Add a simple GET /test endpoint to the Hono server that returns a JSON response `{"test": "ok"}` with status 200 and content-type application/json. This endpoint will serve as a test/health check endpoint for automated workflow validation.

## User Story
As a developer or automated testing system
I want to call GET /test and receive a simple JSON response
So that I can verify the server is responding correctly and the API infrastructure is working

## Problem Statement
The application currently lacks a simple test endpoint that can be used for basic health checks and workflow validation. Automated systems need a lightweight endpoint that returns a predictable response to verify server availability and JSON handling.

## Solution Statement
Create a new GET /test endpoint in the Hono server that returns `{"test": "ok"}` with status 200 and content-type application/json. This will follow the existing patterns used in other endpoints like /hello and /version, using Hono's c.json() method to ensure proper JSON formatting and headers.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono server file where routes are defined. This is where the new /test endpoint will be added following the pattern of existing endpoints like /hello and /version.
- `server/src/index.test.ts` - Server unit tests using Bun test runner. New tests for the /test endpoint will be added here following the existing test patterns for /version.
- `shared/src/types/index.ts` - Shared TypeScript type definitions. A new TestResponse type will be added here to ensure type safety.

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New Playwright e2e test file to verify the /test endpoint is accessible and returns the correct response.

## Implementation Plan
### Phase 1: Foundation
Define the TypeScript type for the test endpoint response in the shared package to enable type safety between server and potential client usage.

### Phase 2: Core Implementation
Implement the GET /test endpoint in the Hono server following existing patterns, and add comprehensive unit tests using the Bun test runner.

### Phase 3: Integration
Add end-to-end tests using Playwright to verify the endpoint works correctly in a deployed environment and validate all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add shared TypeScript type
- Add `TestResponse` type to `shared/src/types/index.ts`
- The type should define the structure: `{ test: string }`

### Step 2: Write unit tests for /test endpoint
- Add comprehensive unit tests in `server/src/index.test.ts` following the pattern of /version endpoint tests
- Test for status 200
- Test for correct JSON structure with "test" property
- Test for exact response value `{"test": "ok"}`
- Test for application/json content-type header

### Step 3: Implement /test endpoint
- Add the GET /test route in `server/src/index.ts` after the /version endpoint
- Use the TestResponse type for type safety
- Return `c.json({ test: "ok" }, { status: 200 })`
- Follow the existing code style and patterns

### Step 4: Write e2e tests for /test endpoint
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Test that GET request to /test returns status 200
- Test that response body is exactly `{"test": "ok"}`
- Test that content-type header is application/json
- Follow the existing Playwright test patterns from other e2e tests

### Step 5: Run validation commands
- Execute `bun run test` to ensure all tests pass with zero failures
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to ensure type safety across all workspaces

## Testing Strategy
### E2E Tests
- **Test endpoint accessibility**: Verify GET /test is accessible and returns 200 status
- **Test response body**: Verify the response body is exactly `{"test": "ok"}`
- **Test content-type header**: Verify the content-type is application/json
- **Integration with server**: Verify the endpoint works in a full deployed environment with Playwright

### Unit Tests
- **Status code test**: Verify the endpoint returns HTTP 200
- **Response structure test**: Verify the response has a "test" property
- **Response value test**: Verify the "test" property equals "ok"
- **Content-type test**: Verify the content-type header is application/json
- **Type safety test**: Verify the response conforms to TestResponse type

### Integration Tests
The e2e tests serve as integration tests, validating the endpoint works end-to-end with:
- Server routing configured correctly
- CORS middleware allowing requests
- JSON serialization working properly
- HTTP response headers set correctly

### Edge Cases
- **Missing route**: Verify 404 is returned for invalid endpoints (existing behavior)
- **HTTP methods**: Only GET is supported; other methods would use default Hono behavior
- **CORS**: Endpoint should respect existing CORS configuration
- **Type safety**: TypeScript compiler should catch type mismatches

## Acceptance Criteria
- GET /test returns status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is application/json
- All existing tests continue to pass (zero regressions)
- New unit tests pass for the /test endpoint
- New e2e tests pass for the /test endpoint
- TypeScript compilation succeeds with no errors
- Code follows existing patterns and conventions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests across workspaces; all tests must pass including new /test endpoint tests
- `bun run build` - Build all workspaces to ensure no compilation errors in server, client, or shared packages
- `bun run type-check` - Type check all workspaces to ensure TestResponse type is properly defined and used
- `bun run test:e2e` - Run Playwright e2e tests to validate the endpoint works in a deployed environment
- `curl http://localhost:8787/test` - Manual verification that endpoint returns `{"test":"ok"}` (when server is running)

## Notes
- This endpoint is intentionally simple for automated workflow testing
- The implementation follows established patterns in the codebase (similar to /version and /hello)
- No new dependencies are required; uses existing Hono framework capabilities
- The TestResponse type ensures type safety even though this is a simple endpoint
- This endpoint will be cleaned up after validation as noted in the issue description
- The endpoint does not require authentication or environment variables, unlike /version
