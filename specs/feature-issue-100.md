# Feature: Add /test endpoint returning {test: "ok"}

## Feature Description
Add a simple REST API endpoint `GET /test` to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint follows the existing patterns in the codebase for JSON API endpoints, including proper CORS support and type-safe responses.

## User Story
As a developer testing the auto-implement workflow
I want to have a simple `/test` endpoint that returns a predictable JSON response
So that I can validate that the automated workflow correctly implements API endpoints

## Problem Statement
The auto-implement workflow needs a simple test case to validate that it can correctly implement new API endpoints following the project's patterns and conventions.

## Solution Statement
Add a new `GET /test` endpoint to the Hono server that returns a type-safe JSON response `{"test": "ok"}` with status 200 and content-type `application/json`. This will follow the existing pattern used for `/hello` and `/version` endpoints, including shared type definitions and comprehensive testing.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - The main Hono application file where all API routes are defined. This is where we'll add the new `/test` endpoint following the existing pattern.
- `server/src/index.test.ts` - Unit tests for server endpoints using Bun's test runner. We'll add tests for the new endpoint here.
- `shared/src/types/index.ts` - Shared type definitions between client and server. We'll add a `TestResponse` type here.
- `e2e/tests/` - End-to-end tests directory for Playwright tests.

### New Files
- `e2e/tests/test-endpoint.spec.ts` - E2E test to validate the `/test` endpoint works correctly from an end-to-end perspective.

## Implementation Plan
### Phase 1: Foundation
Create the shared type definition `TestResponse` in the shared package that will be used by both the server implementation and tests. This ensures type safety across the entire stack.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the existing patterns. The endpoint should return a JSON response with the `TestResponse` type, include proper status code (200), and work with the existing CORS middleware.

### Phase 3: Integration
Write comprehensive tests (unit and e2e) to validate the endpoint works correctly, returns the expected response, has the correct content-type header, and integrates properly with the existing server infrastructure.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add shared type definition
- Add `TestResponse` type to `shared/src/types/index.ts` following the existing pattern
- Export the new type from the types file

### 2. Write unit tests for /test endpoint
- Add a new test suite in `server/src/index.test.ts` for the `/test` endpoint
- Test that the endpoint returns status 200
- Test that the response has correct JSON structure `{"test": "ok"}`
- Test that content-type header is `application/json`
- Follow the existing test pattern used for `/version` endpoint

### 3. Write E2E test for /test endpoint
- Create `e2e/tests/test-endpoint.spec.ts`
- Test that the `/test` endpoint is accessible
- Test that it returns status 200
- Test that response body matches `{"test": "ok"}`
- Test that content-type is application/json

### 4. Implement the /test endpoint
- Add the `GET /test` route in `server/src/index.ts`
- Use the `TestResponse` type for type safety
- Return JSON response with `{"test": "ok"}`
- Return status code 200
- Follow the pattern used by existing `/hello` endpoint

### 5. Run validation commands
- Run `bun run test` to ensure all tests pass
- Run `bun run build` to ensure no compilation errors
- Run `bun run type-check` to ensure type safety across all workspaces

## Testing Strategy
### E2E Tests
- Create a Playwright test that makes an HTTP request to `GET /test` endpoint
- Verify the response status is 200
- Verify the response body is `{"test": "ok"}`
- Verify the content-type header is `application/json`
- Test should work in the context of the full application stack

### Unit Tests
- Test the `/test` endpoint in isolation using `app.request()` pattern from Bun's test framework
- Verify status code is 200
- Verify response JSON structure matches `TestResponse` type
- Verify response data is exactly `{"test": "ok"}`
- Verify content-type header is present and correct

### Integration Tests
The unit tests serve as integration tests since they test the endpoint within the context of the Hono application with CORS middleware enabled.

### Edge Cases
- Verify the endpoint returns correct response even without environment bindings (unlike `/version` which uses env vars)
- Verify CORS headers are properly set by the existing middleware
- Test that the endpoint is accessible via HTTP GET method only (Hono handles other methods automatically with 405)

## Acceptance Criteria
- `GET /test` endpoint returns HTTP status 200
- Response body is exactly `{"test": "ok"}` in JSON format
- Response content-type header is `application/json`
- Unit tests pass for the endpoint
- E2E tests pass for the endpoint
- Type checking passes with no errors
- Build completes successfully with no errors
- All existing tests continue to pass (zero regressions)

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests including the new tests for `/test` endpoint
- `bun run test:e2e` - Run end-to-end tests to validate the `/test` endpoint works in the full stack
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `curl http://localhost:8787/test` (with dev server running) - Manual verification that endpoint returns `{"test": "ok"}`

## Notes
- This is a test issue for the auto-implement workflow and will be cleaned up after validation
- The endpoint follows the existing patterns in the codebase (similar to `/hello` and `/version`)
- No new dependencies are required
- The implementation is intentionally simple to serve as a workflow validation test
- Type safety is maintained end-to-end using the shared `TestResponse` type
