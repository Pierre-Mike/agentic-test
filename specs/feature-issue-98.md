# Feature: Add /test Endpoint

## Feature Description
Add a simple test endpoint `GET /test` to the Hono server that returns a JSON response with status 200. This endpoint will return a simple test object `{"test": "ok"}` and can be used for health checks, automated testing, or API validation.

## User Story
As a developer or automated system
I want to call a simple test endpoint
So that I can verify the API is responsive and working correctly

## Problem Statement
The application currently lacks a simple, dedicated test endpoint that can be used for quick health checks or automated validation of the API's availability and correct JSON response formatting.

## Solution Statement
Add a new `GET /test` endpoint to the Hono server that returns a minimal JSON response `{"test": "ok"}` with status 200 and content-type `application/json`. This follows the existing patterns established by the `/hello` and `/version` endpoints, using Hono's fluent API and type-safe response formatting.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main server file where the Hono app is defined and endpoints are registered. This is where the new `/test` route will be added using the `.get("/test", ...)` chain pattern.
- `shared/src/types/index.ts` - Contains shared TypeScript type definitions. A new `TestResponse` type will be added here to ensure type safety for the endpoint response.
- `server/src/index.test.ts` - Contains unit tests for server endpoints. Tests for the new `/test` endpoint will be added here following the existing test patterns.
- `e2e/tests/api.spec.ts` - Contains end-to-end API tests using Playwright. E2E tests for the `/test` endpoint will be added here.

### New Files
No new files are required. All changes will be made to existing files.

## Implementation Plan
### Phase 1: Foundation
Define the TypeScript type for the test response in the shared types module to ensure type safety across the application.

### Phase 2: Core Implementation
Add the `/test` endpoint to the Hono server using the established fluent API pattern, implementing the handler to return the correct JSON response.

### Phase 3: Integration
Write comprehensive tests (unit and E2E) to validate the endpoint works correctly and integrates properly with the existing server infrastructure.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type definition
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type: `export type TestResponse = { test: string };`
- This ensures type safety for the endpoint response

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new test case in the existing describe block for the `/test` endpoint
- Test that the endpoint returns status 200
- Test that the response body matches `{"test": "ok"}`
- Test that the response content-type is `application/json`
- Use the existing test pattern with `app.request()` and type assertion with `TestResponse`

### Step 3: Write E2E test for /test endpoint
- Open `e2e/tests/api.spec.ts` (or create if it doesn't exist)
- Add a test that makes a real HTTP request to `GET /test`
- Verify status code is 200
- Verify response body is `{"test": "ok"}`
- Verify content-type header is `application/json`

### Step 4: Implement /test endpoint
- Open `server/src/index.ts`
- Add a new `.get("/test", ...)` chain to the Hono app
- Implement the handler to return `c.json({ test: "ok" }, { status: 200 })`
- Use the `TestResponse` type for type safety

### Step 5: Run validation commands
- Execute `bun run test` to validate all tests pass
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to ensure type safety

## Testing Strategy
### E2E Tests
- **Full request flow test**: Make a real HTTP GET request to `/test` endpoint, verify it returns 200 status, correct JSON body `{"test": "ok"}`, and proper content-type header `application/json`

### Unit Tests
- **Status code test**: Verify the endpoint returns status 200
- **Response body test**: Verify the response body exactly matches `{"test": "ok"}`
- **Content-type test**: Verify the response content-type is `application/json`
- **Type safety test**: Use TypeScript type assertion to ensure the response conforms to `TestResponse` type

### Integration Tests
No separate integration tests needed. The unit tests validate integration with Hono's request/response handling, and E2E tests validate full stack integration.

### Edge Cases
- **Case sensitivity**: Verify `/test` works but `/Test` or `/TEST` returns 404 (Hono's default behavior)
- **Method validation**: Verify POST, PUT, DELETE to `/test` return 405 Method Not Allowed or 404 (Hono's default behavior)
- **CORS headers**: Verify CORS middleware is applied (inherited from existing `.use(cors())`)

## Acceptance Criteria
- `GET /test` returns status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is `application/json`
- All existing tests continue to pass (zero regressions)
- New unit tests pass for the `/test` endpoint
- New E2E tests pass for the `/test` endpoint
- TypeScript compilation succeeds with no errors
- Type checking passes with no errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces
- `curl -i http://localhost:3000/test` - Manual test to verify endpoint returns correct response with proper headers (requires server to be running)

## Notes
- This endpoint follows the exact same pattern as existing endpoints (`/hello`, `/version`)
- The implementation is straightforward and requires no external dependencies
- The endpoint can be extended in the future if additional test functionality is needed
- Consider adding this endpoint to API documentation if documentation exists
