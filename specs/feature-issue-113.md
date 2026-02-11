# Feature: Add /test endpoint

## Feature Description
Add a simple GET endpoint `/test` to the Hono server that returns a JSON response with the structure `{"test": "ok"}`. This endpoint will serve as a test endpoint for automated workflow validation and demonstrates the basic pattern for adding new API endpoints to the bhvr stack.

## User Story
As a developer working with the automated workflow system
I want a simple `/test` endpoint that returns predictable JSON data
So that I can validate API functionality and test the auto-implementation workflow

## Problem Statement
The automated workflow testing system requires a simple, predictable endpoint to validate that the auto-implementation process can successfully add new API endpoints to the codebase. Currently, there is no dedicated test endpoint with a minimal response structure.

## Solution Statement
Implement a new GET endpoint at `/test` that returns a JSON response `{"test": "ok"}` with status 200 and content-type `application/json`. The endpoint will follow the existing patterns used by `/hello` and `/version` endpoints in the codebase, including proper type definitions, unit tests, and e2e tests.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main Hono application file where all routes are defined. Will add the new `/test` endpoint here following the existing pattern of `.get()` route handlers.
- `server/src/index.test.ts` - Unit tests for server endpoints using Bun test framework. Will add comprehensive tests for the `/test` endpoint.
- `shared/src/types/index.ts` - Shared TypeScript type definitions. Will add a `TestResponse` type for type safety.
- `e2e/tests/homepage.spec.ts` - End-to-end tests using Playwright. Will add e2e tests for the `/test` endpoint.

### New Files
None required - all implementation will be added to existing files.

## Implementation Plan
### Phase 1: Foundation
Define the shared type for the test response in the `shared` package to ensure type safety across client and server. This follows the existing pattern of `ApiResponse` and `VersionResponse` types.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the existing route handler pattern. The endpoint will return a JSON response with the TestResponse type and proper status code.

### Phase 3: Integration
Add comprehensive unit tests and e2e tests to validate the endpoint works correctly and meets all acceptance criteria. Ensure the endpoint integrates properly with the existing CORS middleware and server configuration.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type definition
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type with the structure: `{ test: string }`
- Export the type so it's available to both server and client

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new `describe` block for "/test endpoint"
- Add test case: "should return status 200"
- Add test case: "should return JSON with correct structure"
- Add test case: "should return {test: 'ok'} in response body"
- Add test case: "should have application/json content-type"
- Follow the exact pattern used in the `/version` endpoint tests

### Step 3: Write e2e test for /test endpoint
- Open `e2e/tests/homepage.spec.ts`
- Add a new test case: "test endpoint returns correct response"
- Make a fetch request to the `/test` endpoint
- Assert status is 200
- Assert response body is `{"test": "ok"}`
- Assert content-type is `application/json`

### Step 4: Implement /test endpoint
- Open `server/src/index.ts`
- Import `TestResponse` type from "shared/dist"
- Add a new `.get("/test", ...)` route handler after the `/version` endpoint
- Create a TestResponse object: `{ test: "ok" }`
- Return the response with `c.json(data, { status: 200 })`
- Follow the exact pattern used by the `/hello` endpoint

### Step 5: Run validation commands
- Execute `bun run test` to ensure all tests pass
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to validate type safety
- Verify the endpoint works correctly with zero regressions

## Testing Strategy
### E2E Tests
- **Test endpoint availability**: Verify the `/test` endpoint is accessible and returns a 200 status code
- **Test response structure**: Validate that the response body matches `{"test": "ok"}` exactly
- **Test content-type header**: Confirm the response has `application/json` content-type
- **Integration with frontend**: Ensure the endpoint can be called from the frontend client if needed

### Unit Tests
- **Status code validation**: Test that the endpoint returns status 200
- **Response structure validation**: Test that the response has the correct TypeScript type (TestResponse)
- **Response content validation**: Test that the response body contains `{"test": "ok"}`
- **Content-type validation**: Test that the response has the correct `application/json` content-type header

### Integration Tests
The unit tests serve as integration tests since they use the Hono test request method which tests the full request/response cycle including middleware (CORS).

### Edge Cases
- **Direct request**: Test making a direct HTTP GET request to `/test`
- **CORS handling**: Verify CORS middleware applies to the `/test` endpoint
- **Type safety**: Ensure TypeScript compilation catches any type mismatches with TestResponse

## Acceptance Criteria
- [ ] `GET /test` endpoint exists and is accessible
- [ ] Endpoint returns HTTP status 200
- [ ] Response body is exactly `{"test": "ok"}`
- [ ] Response content-type header is `application/json`
- [ ] TestResponse type is defined in shared types
- [ ] All unit tests pass with 100% coverage of the endpoint
- [ ] All e2e tests pass
- [ ] No TypeScript compilation errors
- [ ] No linting errors
- [ ] Zero regressions in existing tests

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests including new unit tests for `/test` endpoint
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to validate TestResponse type
- `bun run lint` - Ensure code follows linting rules
- `curl http://localhost:8787/test` - Manual test to verify endpoint returns `{"test": "ok"}` (when server is running)

## Notes
- This endpoint is intentionally simple to serve as a test case for the automated workflow system
- The endpoint follows the existing architectural patterns in the codebase (Hono route handlers, shared types, comprehensive testing)
- No new dependencies are required
- The endpoint will be used for automated workflow validation and can be safely removed after testing if needed
- Following the principle of consistency, this endpoint uses the same patterns as `/hello` and `/version` endpoints
