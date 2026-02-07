# Feature: Test Endpoint

## Feature Description
Add a simple GET `/test` endpoint that returns a JSON response `{"test": "ok"}`. This endpoint serves as a lightweight health check or test endpoint that can be used to verify the server is running and responding correctly. It provides a minimal JSON response with guaranteed structure, making it ideal for automated testing, monitoring, and validation purposes.

## User Story
As a developer or automated testing system
I want to call a simple test endpoint that returns a predictable JSON response
So that I can quickly verify the server is running and responding correctly without side effects

## Problem Statement
Currently, there is no dedicated lightweight test endpoint that:
- Returns a simple, predictable JSON response
- Can be used for automated workflow testing
- Provides a minimal endpoint for health checks and validation
- Has guaranteed response structure for testing purposes

## Solution Statement
Implement a GET `/test` endpoint in the Hono server that returns a JSON response with the structure `{"test": "ok"}` and a 200 status code. The endpoint will follow existing patterns in the codebase, include proper TypeScript types in the shared package, and be fully tested with both unit tests and e2e tests.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono application where the new `/test` endpoint will be added (following the pattern of existing endpoints like `/hello` and `/version`)
- `shared/src/types/index.ts` - Shared types directory where we'll add the TestResponse type for type safety
- `server/src/index.test.ts` - Existing test file where we'll add unit tests for the `/test` endpoint

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New e2e test file to validate the `/test` endpoint works end-to-end

## Implementation Plan
### Phase 1: Foundation
Create the shared TypeScript type for the test response to ensure type safety between server and any potential client usage. This establishes the contract for the API response structure following the same pattern as ApiResponse and VersionResponse types.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server. The endpoint will:
1. Define a GET route handler for `/test`
2. Create a response object matching the TestResponse type with `{"test": "ok"}`
3. Return the JSON response with a 200 status code
4. Follow the same implementation pattern as existing endpoints for consistency

### Phase 3: Integration
Add comprehensive unit and e2e tests to verify the endpoint works correctly. Ensure the endpoint integrates seamlessly with existing CORS middleware and doesn't interfere with other routes.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Define the TestResponse type
- Open `shared/src/types/index.ts`
- Add a new exported type `TestResponse` with the structure:
  - `test: "ok"` - A literal type to ensure the response always contains exactly "ok"

### Step 2: Write unit tests for the /test endpoint
- Open `server/src/index.test.ts`
- Add a new test suite `describe("/test endpoint", () => {...})`
- Add test to verify the endpoint returns status 200
- Add test to verify the response has correct JSON structure with `{"test": "ok"}`
- Add test to verify the content-type header is application/json
- Follow the same testing pattern used for the `/version` endpoint tests

### Step 3: Write e2e test for the /test endpoint
- Create a new file `e2e/tests/test-endpoint.spec.ts`
- Add a test that makes a request to `/test` endpoint
- Verify the response status is 200
- Verify the response body is `{"test": "ok"}`
- Verify the content-type is application/json
- Follow the same pattern as existing e2e tests in the codebase

### Step 4: Implement the /test endpoint
- Open `server/src/index.ts`
- Import the TestResponse type from shared/dist
- Add a new GET route handler for `/test` after the existing routes
- Create a data object of type TestResponse with `{test: "ok"}`
- Return the JSON response with status 200: `return c.json(data, { status: 200 })`
- Follow the same implementation style as the `/hello` endpoint

### Step 5: Run validation commands
- Execute `bun run test` to ensure all unit tests pass
- Execute `bun run test:e2e` to ensure e2e tests pass
- Execute `bun run build` to verify no compilation errors
- Execute `bun run type-check` to verify type safety across all workspaces

## Testing Strategy
### E2E Tests
- Test that GET `/test` returns status 200 when called from a browser/client
- Test that the response body is exactly `{"test": "ok"}`
- Test that the content-type header is application/json
- Verify the endpoint is accessible and doesn't require authentication

### Unit Tests
- Test that the `/test` endpoint returns a 200 status code
- Test that the response body contains the exact structure `{"test": "ok"}`
- Test that the `test` field has the value "ok" (not any other string)
- Test that the response content-type is application/json

### Integration Tests
- Verify the endpoint works with the existing CORS middleware
- Ensure the endpoint doesn't break other existing routes
- Test that the endpoint is accessible via HTTP GET
- Verify type safety between server implementation and shared types

### Edge Cases
- Verify the endpoint only accepts GET requests (not POST, PUT, etc.)
- Ensure the response is always consistent (no dynamic values)
- Verify the endpoint works in both development and production builds
- Test that the TypeScript literal type `"ok"` is enforced at compile time

## Acceptance Criteria
- [ ] GET `/test` endpoint exists and is accessible
- [ ] Endpoint returns HTTP 200 status code
- [ ] Response is valid JSON with content-type application/json
- [ ] Response body is exactly `{"test": "ok"}`
- [ ] TestResponse type is defined in shared types with literal type `"ok"`
- [ ] Unit tests pass for status code, response structure, and content-type
- [ ] E2E tests pass for the endpoint
- [ ] All existing tests continue to pass (zero regressions)
- [ ] Build completes successfully with no errors
- [ ] Type checking passes across all workspaces

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the feature works with zero regressions
- `bun run test:e2e` - Run end-to-end tests to validate the endpoint works in a real browser environment
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety

## Notes
- The endpoint follows the exact same pattern as `/hello` and `/version` endpoints for consistency
- Using a TypeScript literal type `"ok"` ensures compile-time type safety
- The endpoint is intentionally simple with no dynamic behavior for maximum reliability
- This endpoint is ideal for automated testing workflows as it has guaranteed, predictable behavior
- The response structure is minimal but follows JSON API best practices
- No external dependencies or environment variables are required
- The endpoint can be used as a smoke test or health check in CI/CD pipelines
- This implementation serves as a good example for adding future simple endpoints
