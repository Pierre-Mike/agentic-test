# Feature: Add /test endpoint

## Feature Description
Add a simple GET endpoint at `/test` that returns a JSON response with `{"test": "ok"}`. This endpoint will be used for automated workflow testing and validation. The endpoint follows the existing pattern used in the Hono server for JSON API responses with proper type safety and content-type headers.

## User Story
As a developer/tester
I want to have a simple test endpoint that returns a predictable response
So that I can validate the server is running correctly and test automated workflows

## Problem Statement
The project needs a simple, reliable endpoint for testing purposes that can be used to validate server functionality, automated workflows, and deployments. Without such an endpoint, testing becomes more complex and relies on existing functional endpoints that may change over time.

## Solution Statement
Create a new GET endpoint at `/test` that returns a typed JSON response `{"test": "ok"}` with status 200 and application/json content-type. This endpoint will follow the existing architectural patterns in the codebase, using shared TypeScript types for type safety between client and server, and will include comprehensive tests.

## Relevant Files
Use these files to implement the feature:

- **server/src/index.ts** - Main Hono application file where all routes are defined. This is where the new `/test` endpoint will be added following the pattern of existing endpoints like `/hello` and `/version`.
- **server/src/index.test.ts** - Test file for server endpoints using Bun's test framework. New tests for the `/test` endpoint will be added here following the existing test structure used for `/version`.
- **shared/src/types/index.ts** - Shared TypeScript type definitions. A new `TestResponse` type will be added here to ensure type safety between client and server.

### New Files
No new files need to be created. All changes will be made to existing files following the established patterns.

## Implementation Plan
### Phase 1: Foundation
Define the shared TypeScript type for the test endpoint response. This ensures type safety across the entire stack and follows the existing pattern where all API responses have corresponding types in the shared package.

### Phase 2: Core Implementation
Implement the GET `/test` endpoint in the server following the exact same pattern as existing endpoints like `/hello`. The endpoint will use the shared type, return status 200, and include proper JSON response formatting.

### Phase 3: Integration
Write comprehensive tests covering all acceptance criteria including status code, response body structure, and content-type header. This ensures the endpoint works correctly and prevents regressions.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type with the structure `{ test: string }`
- This type will be exported and available for both server and client usage

### Step 2: Write tests for /test endpoint
- Open `server/src/index.test.ts`
- Create a new test suite for `/test` endpoint
- Write test case: "should return status 200"
- Write test case: "should return JSON with correct structure {test: 'ok'}"
- Write test case: "should have application/json content-type"
- Follow the exact pattern used in the `/version` endpoint tests

### Step 3: Implement /test endpoint
- Open `server/src/index.ts`
- Add the import for `TestResponse` type from shared package
- Implement the GET `/test` endpoint using `.get("/test", (c) => {...})`
- Return `c.json(data, { status: 200 })` with data typed as `TestResponse`
- Ensure the response is `{ test: "ok" }`

### Step 4: Run validation commands
- Run `bun run test` to ensure all tests pass including the new endpoint tests
- Run `bun run build` to verify no compilation errors
- Run `bun run type-check` to verify type safety across all packages

## Testing Strategy
### E2E Tests
Not applicable for this feature as it's a simple API endpoint that doesn't involve user interface interaction. The endpoint will be tested through integration tests that validate the full HTTP request/response cycle.

### Unit Tests
- Test that `/test` endpoint returns status 200
- Test that `/test` endpoint returns correct JSON structure `{test: "ok"}`
- Test that `/test` endpoint response has application/json content-type header
- All tests use Bun's test framework and the Hono app.request() method

### Integration Tests
The tests written in `server/src/index.test.ts` serve as integration tests:
- They test the full request/response cycle through the Hono application
- They validate response structure, status codes, and headers
- They use the actual app instance (not mocked) to ensure real behavior

### Edge Cases
- Verify endpoint works without environment variables (doesn't use env bindings)
- Verify endpoint follows exact response structure (no extra or missing fields)
- Verify content-type header is correctly set by Hono's c.json() method

## Acceptance Criteria
- GET `/test` returns HTTP status 200
- Response body is exactly `{"test": "ok"}`
- Response content-type header is `application/json`
- TestResponse type is defined in shared package and used in server
- All tests pass with 100% coverage of the new endpoint
- No TypeScript compilation errors
- No breaking changes to existing endpoints

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the new /test endpoint works and no regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to verify type safety

## Notes
- This is a test endpoint that will be used for automated workflow validation
- The endpoint is intentionally simple and doesn't use environment variables or complex logic
- Following the existing patterns in the codebase ensures consistency and maintainability
- The endpoint can be cleaned up after workflow validation if needed
- The implementation should take less than 15 lines of code across all three files (type definition, endpoint, tests)
