# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint to the Hono server that returns a fixed JSON response. This endpoint serves as a health check or validation endpoint that can be used to verify the API is running and responding correctly. The endpoint returns a minimal JSON object with a single property indicating the test is successful.

## User Story
As a developer or automated testing system
I want to call a simple test endpoint
So that I can verify the API server is operational without side effects

## Problem Statement
Currently, there is no simple, lightweight endpoint that can be used purely for testing purposes. While `/version` exists, it returns environment-specific data and serves a different purpose. A dedicated test endpoint provides a predictable, static response ideal for validation and automated testing workflows.

## Solution Statement
Implement a new `GET /test` endpoint in the Hono server that returns a static JSON response `{"test": "ok"}` with HTTP status 200 and content-type application/json. The endpoint will follow existing patterns in the codebase for JSON endpoints, using TypeScript types from the shared package for type safety.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main Hono application file where all routes are defined. This is where the new `/test` endpoint will be added, following the same pattern as existing `/hello` and `/version` endpoints.

- **server/src/index.test.ts** - Server unit tests using Bun's test framework. Will add comprehensive test coverage for the new `/test` endpoint including status code, response structure, and content-type validation.

- **shared/src/types/index.ts** - Shared TypeScript type definitions. Will add a new `TestResponse` type to maintain type safety between client and server.

### New Files
- **e2e/tests/test-endpoint.spec.ts** - New E2E test file using Playwright to validate the `/test` endpoint works correctly in a real browser environment.

## Implementation Plan
### Phase 1: Foundation
Create the shared TypeScript type definition for the test endpoint response. This ensures type safety across the entire application and follows the existing pattern used by `ApiResponse` and `VersionResponse`.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the same patterns as existing endpoints. The endpoint will use method chaining, return typed JSON data, and include explicit status codes.

### Phase 3: Integration
Verify the endpoint integrates correctly with the existing Hono application, CORS middleware, and Cloudflare Workers deployment environment. Ensure all tests pass and the build succeeds.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add new `TestResponse` type definition: `export type TestResponse = { test: string; }`
- This provides type safety for the test endpoint response

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new test suite `describe("/test endpoint", () => {...})`
- Test 1: Verify endpoint returns status 200
- Test 2: Verify response JSON has correct structure with `test` property
- Test 3: Verify `test` property value is "ok"
- Test 4: Verify response content-type is application/json
- Follow the exact pattern used in the existing `/version` endpoint tests

### Step 3: Write E2E test for /test endpoint
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Add test to verify endpoint is accessible via HTTP
- Add test to verify response status is 200
- Add test to verify response body is `{"test": "ok"}`
- Add test to verify content-type header is application/json
- Use Playwright's request context to test the API directly

### Step 4: Implement /test endpoint
- Open `server/src/index.ts`
- Import `TestResponse` type from shared package
- Add new route using `.get("/test", (c) => {...})`
- Create response object with type `TestResponse = { test: "ok" }`
- Return `c.json(data, { status: 200 })`
- Place the endpoint after `/version` to maintain alphabetical ordering

### Step 5: Run validation commands
- Execute all validation commands listed below to ensure zero regressions
- Verify all tests pass including the new unit and E2E tests
- Verify build completes without errors
- Verify type checking passes

## Testing Strategy
### E2E Tests
Create a new E2E test file `e2e/tests/test-endpoint.spec.ts` that:
- Tests the `/test` endpoint is accessible via HTTP request
- Validates the response status code is 200
- Validates the response body structure matches `{"test": "ok"}`
- Validates the content-type header is application/json
- Uses Playwright's API request context for direct API testing

### Unit Tests
Add comprehensive unit tests in `server/src/index.test.ts`:
- Test the endpoint returns HTTP status 200
- Test the response is valid JSON with correct structure
- Test the response has a `test` property of type string
- Test the `test` property value equals "ok"
- Test the content-type header contains "application/json"
- Follow the same pattern as existing `/version` endpoint tests

### Integration Tests
No separate integration tests needed as the E2E tests cover integration with the deployed server.

### Edge Cases
- Endpoint should handle requests with query parameters gracefully (ignore them)
- Endpoint should respond to HEAD requests (Hono handles this automatically)
- CORS headers should be present (handled by existing CORS middleware)

## Acceptance Criteria
- `GET /test` returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is application/json
- All existing tests continue to pass (zero regressions)
- New unit tests pass for the `/test` endpoint
- New E2E tests pass for the `/test` endpoint
- TypeScript compilation succeeds with no errors
- Code follows existing patterns and conventions in the codebase

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests including new /test endpoint tests
- `bun run test:e2e` - Run all E2E tests including new test-endpoint.spec.ts
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `curl https://server.pierre-michael-twagirayezu.workers.dev/test` - Manually verify deployed endpoint (after deployment)

## Notes
- This is a test issue for the auto-implementation workflow and will be cleaned up after validation
- The endpoint is intentionally simple with no business logic or side effects
- The response is static and does not depend on environment variables or external state
- This pattern can be reused for other health check or status endpoints in the future
- The TestResponse type could be extended in the future if more test endpoints are needed
