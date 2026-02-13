# Feature: Add /test endpoint returning {test: "ok"}

## Feature Description
This feature adds a new simple GET endpoint `/test` to the Hono server that returns a JSON response with status 200 and a content-type of application/json. The response body will be `{"test": "ok"}`. This endpoint serves as a test endpoint for automated workflow validation.

## User Story
As a developer testing the API
I want to call a `/test` endpoint
So that I can verify the server is responding correctly with a known response format

## Problem Statement
The server currently lacks a simple test endpoint that can be used for automated workflow validation and health check purposes. This creates a gap in our ability to quickly validate that the server is running and responding correctly.

## Solution Statement
Add a new GET endpoint `/test` to the Hono server in `server/src/index.ts` that returns a simple JSON response. The endpoint will follow the existing patterns used by other endpoints like `/hello` and `/version`, ensuring consistency with the codebase. The response will be a simple object `{"test": "ok"}` with a 200 status code and application/json content-type.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main Hono app setup where all endpoints are defined. This is where the new `/test` endpoint will be added.
- **server/src/index.test.ts** - Unit tests for server endpoints. Tests for the new `/test` endpoint will be added here.
- **e2e/test-endpoint.spec.ts** - E2E test file to verify the endpoint works correctly in a real environment.

### New Files
- **e2e/test-endpoint.spec.ts** - New Playwright e2e test file to validate the `/test` endpoint acceptance criteria.

## Implementation Plan
### Phase 1: Foundation
Write comprehensive tests first to define the expected behavior. This includes both unit tests to verify the endpoint logic and e2e tests to verify the full HTTP request/response cycle.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following existing patterns. The endpoint should use `c.json()` to return the response with explicit status code 200.

### Phase 3: Integration
Validate the implementation by running all tests and build commands to ensure zero regressions and that the new endpoint integrates seamlessly with the existing server.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Write E2E Test
- Create `e2e/test-endpoint.spec.ts` with Playwright tests
- Test that `GET /test` returns status 200
- Test that response body is exactly `{"test": "ok"}`
- Test that response content-type is `application/json`

### Step 2: Write Unit Test
- Add test cases to `server/src/index.test.ts`
- Test that `/test` endpoint returns status 200
- Test that response body matches `{"test": "ok"}`
- Test that response content-type header is `application/json`

### Step 3: Implement the Endpoint
- Add the `GET /test` endpoint to `server/src/index.ts`
- Use `c.json({ test: "ok" }, { status: 200 })` to return the response
- Follow the existing pattern used by `/hello` and `/version` endpoints

### Step 4: Run Validation Commands
- Execute `bun run test` to ensure all tests pass
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to ensure TypeScript types are correct

## Testing Strategy
### E2E Tests
- **Test 1:** Request `GET /test` and verify HTTP status code is 200
- **Test 2:** Request `GET /test` and verify response body is exactly `{"test": "ok"}`
- **Test 3:** Request `GET /test` and verify content-type header contains `application/json`

### Unit Tests
- **Test 1:** Mock HTTP request to `/test` and verify status code is 200
- **Test 2:** Mock HTTP request to `/test` and verify response body structure matches `{"test": "ok"}`
- **Test 3:** Mock HTTP request to `/test` and verify content-type header is set to `application/json`

### Integration Tests
No additional integration tests needed beyond the e2e tests, as this endpoint is standalone and doesn't interact with other services or components.

### Edge Cases
- Verify endpoint responds correctly with GET method only
- Verify endpoint doesn't accept POST, PUT, DELETE methods (returns appropriate error)
- Verify response is consistently formatted as JSON

## Acceptance Criteria
- `GET /test` returns status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type is `application/json`
- All existing tests continue to pass (zero regressions)
- Unit tests pass for the new endpoint
- E2E tests pass for the new endpoint
- Build and type-check commands execute without errors

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces
- `bun run test:e2e` - Run e2e tests to validate the endpoint in a real environment
- `curl http://localhost:8787/test` - Manual validation that the endpoint returns the expected response

## Notes
- This is a simple endpoint that follows the existing patterns in the codebase
- No new dependencies are required
- The endpoint uses Hono's built-in `c.json()` method for consistent JSON responses
- This endpoint is designed for automated workflow testing and will be used to validate the auto-implement workflow
