# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint will serve as a basic health check or test verification endpoint that can be used for automated testing, monitoring, or validation purposes.

## User Story
As a developer or automated testing system
I want to call a simple `/test` endpoint
So that I can quickly verify the server is responding correctly with a predictable JSON response

## Problem Statement
The application currently lacks a simple test endpoint that can be used for automated testing workflows, health checks, or quick server validation. This makes it difficult to perform basic connectivity tests or validate that the server infrastructure is functioning correctly.

## Solution Statement
Implement a new `GET /test` endpoint in the Hono server that returns a JSON response with the structure `{"test": "ok"}` and appropriate content-type headers. This will follow the existing pattern used by other endpoints like `/version` and `/hello`, ensuring consistency with the codebase architecture.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main Hono application where all routes are defined. This is where the new `/test` endpoint will be added following the existing pattern of `.get()` method chaining.
- **server/src/index.test.ts** - Unit tests for server endpoints using Bun's test runner. Will add comprehensive unit tests for the new `/test` endpoint to ensure it meets acceptance criteria.
- **shared/src/types/index.ts** - Shared TypeScript type definitions. Will add a new `TestResponse` type for type safety between client and server.
- **e2e/tests/** - End-to-end tests directory where we'll add E2E validation for the new endpoint.

### New Files
- **e2e/tests/test-endpoint.spec.ts** - New E2E test file specifically for testing the `/test` endpoint end-to-end using Playwright.

## Implementation Plan
### Phase 1: Foundation
Define the shared type for the test response to ensure type safety across the monorepo. This follows the existing pattern where response types are defined in the `shared` package and exported for use in both server and client.

### Phase 2: Core Implementation
Add the `/test` endpoint to the Hono server following the existing code patterns. The endpoint will use the `.get()` method and return a JSON response with the appropriate status code and content-type header.

### Phase 3: Integration
Integrate comprehensive testing at both unit and E2E levels to ensure the endpoint works correctly and meets all acceptance criteria. Validate that the endpoint can be called successfully and returns the expected response structure.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Define Shared Type
- Add `TestResponse` type to `shared/src/types/index.ts`
- Export the type from `shared/src/index.ts`
- Rebuild the shared package to make the type available

### 2. Add Unit Tests for /test Endpoint
- Create a new test suite in `server/src/index.test.ts` for the `/test` endpoint
- Add test for status 200 response
- Add test for correct JSON structure `{"test": "ok"}`
- Add test for `application/json` content-type header
- Add test to verify response body matches `TestResponse` type

### 3. Implement /test Endpoint
- Add `.get("/test", ...)` route to `server/src/index.ts` using method chaining
- Return `c.json()` with `TestResponse` typed data
- Set explicit status 200 in the response
- Follow existing code style and patterns from `/hello` and `/version` endpoints

### 4. Add E2E Tests
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Add test to verify endpoint returns 200 status
- Add test to verify response body structure
- Add test to verify content-type is application/json
- Use Playwright's request context to make API calls

### 5. Validate Implementation
- Run all validation commands to ensure zero regressions
- Verify the new endpoint works correctly
- Ensure all tests pass
- Confirm build succeeds with no type errors

## Testing Strategy
### E2E Tests
Create `e2e/tests/test-endpoint.spec.ts` with the following tests:
- **Status Code Test**: Verify `GET /test` returns HTTP 200
- **Response Body Test**: Verify response body is exactly `{"test": "ok"}`
- **Content-Type Test**: Verify response content-type header includes `application/json`
- **Integration Test**: Make actual HTTP request to the running server and validate the full response

### Unit Tests
Add to `server/src/index.test.ts`:
- **Status Code Test**: Mock request to `/test` returns status 200
- **JSON Structure Test**: Response data has `test` property with value `"ok"`
- **Type Safety Test**: Response conforms to `TestResponse` type
- **Content-Type Test**: Response headers include `application/json`

### Integration Tests
The unit tests will serve as integration tests by using Hono's built-in test request functionality (`app.request()`), which exercises the full request/response cycle including middleware like CORS.

### Edge Cases
- **GET Method Only**: Verify endpoint only responds to GET requests
- **Case Sensitivity**: Verify `/test` path is case-sensitive (standard REST behavior)
- **CORS Headers**: Verify CORS middleware is applied correctly to the endpoint
- **No Query Parameters**: Endpoint should work without any query parameters
- **Response Immutability**: Multiple calls should return the same response

## Acceptance Criteria
- ✅ `GET /test` endpoint exists and is accessible
- ✅ Endpoint returns HTTP status 200
- ✅ Response body is exactly `{"test": "ok"}`
- ✅ Response content-type header is `application/json`
- ✅ Response conforms to `TestResponse` type definition
- ✅ All unit tests pass
- ✅ All E2E tests pass
- ✅ No TypeScript compilation errors
- ✅ Code follows existing patterns and style in the codebase
- ✅ Zero regressions in existing functionality

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests (unit + E2E) to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to verify type safety
- `curl http://localhost:8787/test` - Manual curl test to verify endpoint responds correctly (run after starting dev server)
- `bun run lint` - Ensure code follows linting rules
- `bun run format` - Ensure code is properly formatted

## Notes
- This is a test endpoint for automated workflow validation and will be cleaned up after testing
- The endpoint follows the same pattern as existing endpoints like `/hello` and `/version`
- Uses Hono's method chaining pattern for route definition
- Uses Bun's test runner for unit tests (same as existing tests)
- Uses Playwright for E2E tests (same as existing E2E tests)
- No new dependencies required - uses existing stack
- The implementation is intentionally simple to serve as a clear test case
- CORS is automatically applied via the existing `app.use(cors())` middleware
