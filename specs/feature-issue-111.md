# Feature: Add /test endpoint returning {test: "ok"}

## Feature Description
Add a simple GET endpoint at `/test` that returns a JSON response with `{"test": "ok"}`. This endpoint is designed for automated workflow testing and will be used to validate the auto-implementation CI/CD pipeline. The endpoint follows the existing API patterns in the codebase using Hono framework with type-safe responses.

## User Story
As an automated testing system
I want to call a simple test endpoint
So that I can validate the auto-implementation workflow end-to-end

## Problem Statement
The auto-implementation workflow needs a simple, predictable endpoint to test against. This endpoint will be used in automated tests to ensure the workflow can successfully implement features from GitHub issues and validate the entire CI/CD pipeline.

## Solution Statement
Create a new GET `/test` endpoint in the Hono server that returns a JSON response `{"test": "ok"}` with status 200 and content-type `application/json`. The implementation will follow existing patterns in the codebase by:
1. Defining a type-safe `TestResponse` type in the shared package
2. Adding the route to the main Hono app in `server/src/index.ts`
3. Writing comprehensive tests (unit and e2e) to validate the endpoint behavior

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono app where the `/test` endpoint will be added, following the pattern of existing endpoints like `/hello` and `/version`
- `shared/src/types/index.ts` - Shared type definitions where `TestResponse` type will be added for type safety between client and server
- `shared/src/index.ts` - Exports file that re-exports all types from the types folder

### New Files

- `server/src/index.test.ts` - Will be updated with unit tests for the `/test` endpoint (file already exists)
- `e2e/tests/test-endpoint.spec.ts` - New Playwright e2e test file for the `/test` endpoint

## Implementation Plan
### Phase 1: Foundation
Create the shared type definition for the test endpoint response. This ensures type safety across the entire stack and follows the existing pattern used by `ApiResponse` and `VersionResponse`.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the established routing patterns. The endpoint will be a simple GET route that returns a JSON response with the appropriate status code and content type.

### Phase 3: Integration
Validate the endpoint works correctly through comprehensive testing at both the unit level (using Bun test with the Hono app request method) and e2e level (using Playwright to test the actual HTTP endpoint).

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add `TestResponse` type definition with property `test: string`
- Ensure it follows the same pattern as existing types (`ApiResponse`, `VersionResponse`)

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new `describe` block for `/test endpoint`
- Write test: "should return status 200"
- Write test: "should return JSON with correct structure"
- Write test: "should return {test: 'ok'}"
- Write test: "should have application/json content-type"
- Follow the exact pattern used in the existing `/version endpoint` tests

### Step 3: Write e2e test for /test endpoint
- Create `e2e/tests/test-endpoint.spec.ts`
- Write test: "should return 200 status code"
- Write test: "should return correct JSON response body"
- Write test: "should have application/json content-type"
- Follow the pattern used in existing e2e tests but focus on API endpoint testing

### Step 4: Implement /test endpoint in server
- Open `server/src/index.ts`
- Import `TestResponse` type from `shared/dist`
- Add `.get("/test", ...)` route after the existing routes
- Return `c.json({test: "ok"}, {status: 200})`
- Use proper TypeScript typing with `TestResponse`
- Follow the exact pattern of `/hello` endpoint

### Step 5: Run validation commands
- Execute `bun run test` to ensure all unit tests pass
- Execute `bun run build` to ensure compilation succeeds
- Execute `bun run type-check` to validate TypeScript types
- Execute `bun run test:e2e` to validate e2e tests pass
- Verify zero regressions in existing functionality

## Testing Strategy
### E2E Tests
Create `e2e/tests/test-endpoint.spec.ts` with Playwright tests that:
- Make actual HTTP GET request to `/test` endpoint
- Verify response status is 200
- Verify response body matches `{"test": "ok"}`
- Verify content-type header is `application/json`
- Tests the full request/response cycle as a user would experience it

### Unit Tests
Add tests to `server/src/index.test.ts` for the `/test` endpoint that:
- Verify status code is 200
- Verify response body structure matches `TestResponse` type
- Verify response body content is exactly `{test: "ok"}`
- Verify content-type header contains `application/json`
- Use `app.request()` method to test the endpoint in isolation

### Integration Tests
The unit tests serve as integration tests since they test the Hono app with all middleware (CORS) applied through `app.request()`.

### Edge Cases
- Invalid HTTP methods (POST, PUT, DELETE) should not be handled by this endpoint
- Query parameters should be ignored
- Request body should be ignored
- The endpoint has no edge cases as it always returns the same static response

## Acceptance Criteria
- GET request to `/test` returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is `application/json`
- TestResponse type is properly defined in shared package
- All unit tests pass with zero failures
- All e2e tests pass with zero failures
- No regressions in existing endpoints
- TypeScript compilation succeeds with no errors
- Type checking passes with no errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests including new `/test` endpoint tests
- `bun run test:e2e` - Run all e2e tests including new test endpoint validation
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `curl http://localhost:8787/test` - Manual verification of endpoint (requires dev server running)

## Notes
- This endpoint is temporary and will be removed after workflow validation
- The implementation is intentionally simple with no business logic
- The response is static and does not depend on any environment variables or state
- No new dependencies are required - uses existing Hono and TypeScript patterns
- The endpoint follows REST conventions (GET for read-only operations)
- CORS middleware is already configured globally so the endpoint will support cross-origin requests
