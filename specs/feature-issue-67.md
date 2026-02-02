# Feature: Add /test endpoint

## Feature Description
Add a simple test endpoint to the Hono server that returns a JSON response. This endpoint will be used for automated workflow validation and can serve as a health check or smoke test endpoint for testing CI/CD pipelines and deployments.

## User Story
As a developer or CI/CD pipeline
I want to call a simple /test endpoint
So that I can verify the server is running and responding correctly

## Problem Statement
The application needs a lightweight test endpoint that can be used to validate that the server is operational and responding with the correct JSON format. This is particularly useful for automated testing workflows, health checks, and deployment verification.

## Solution Statement
Implement a new GET /test endpoint in the Hono server that returns a simple JSON response `{"test": "ok"}` with status 200 and content-type application/json. The solution will follow existing patterns in the codebase, including proper TypeScript typing and comprehensive test coverage.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main server file where routes are defined. This is where the new /test endpoint will be added following the pattern of existing endpoints like /hello and /version.
- `server/src/index.test.ts` - Test file for server endpoints. Will add comprehensive unit tests for the new /test endpoint following the existing test patterns.
- `shared/src/types/index.ts` - Type definitions shared between client and server. Will add a TestResponse type to maintain type safety across the monorepo.

### New Files
No new files need to be created. All changes will be made to existing files.

## Implementation Plan

### Phase 1: Foundation
Define the TypeScript type for the test endpoint response in the shared package to ensure type safety between client and server.

### Phase 2: Core Implementation
Implement the GET /test endpoint in the Hono server following existing code patterns and conventions.

### Phase 3: Integration
Add comprehensive unit tests to verify the endpoint works correctly and meets all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add a new `TestResponse` type with the structure `{ test: string }`
- Export the type so it can be imported by both client and server

### 2. Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new describe block for "/test endpoint" following the pattern used for "/version endpoint"
- Test 1: Verify endpoint returns status 200
- Test 2: Verify response body has correct structure with `test` property
- Test 3: Verify response body contains `{test: "ok"}`
- Test 4: Verify content-type header is application/json
- Use the TestResponse type for type safety in tests

### 3. Implement /test endpoint
- Open `server/src/index.ts`
- Import the TestResponse type from shared/dist
- Add a new GET /test route using the `.get()` method
- Return `c.json({ test: "ok" }, { status: 200 })`
- Follow the same pattern as existing endpoints (/hello, /version)
- Place the endpoint logically (after /version endpoint)

### 4. Validate implementation
- Run all validation commands to ensure the feature works correctly with zero regressions
- Verify all tests pass
- Verify type checking succeeds
- Verify build completes without errors

## Testing Strategy

### E2E Tests
Not applicable for this simple endpoint. Unit tests provide sufficient coverage.

### Unit Tests
- **Status Code Test**: Verify the endpoint returns HTTP 200 status
- **Response Structure Test**: Verify response contains a `test` property of type string
- **Response Content Test**: Verify response body is exactly `{test: "ok"}`
- **Content-Type Test**: Verify the response has application/json content-type header
- All tests will use Bun's built-in test framework and follow existing patterns

### Integration Tests
Not applicable - this is a standalone endpoint with no dependencies or integrations.

### Edge Cases
- No edge cases to test - this is a simple static response endpoint
- The endpoint has no parameters, no authentication, and no external dependencies

## Acceptance Criteria
- GET /test endpoint is accessible and responds
- Endpoint returns HTTP status 200
- Response body is JSON: `{"test": "ok"}`
- Response content-type header is application/json
- TestResponse type is defined in shared package
- All unit tests pass
- Type checking passes across all workspaces
- Build completes successfully with no errors
- No regressions in existing endpoints or tests

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the new endpoint works and no regressions exist
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to verify type safety

## Notes
- This endpoint is intentionally simple and follows the principle of "no over-engineering"
- The implementation mirrors existing patterns in the codebase (particularly the /hello endpoint)
- No external dependencies or new libraries are required
- The endpoint can be used for health checks, smoke tests, and CI/CD validation
- Future enhancements could include query parameters or environment-specific responses, but these are not part of this initial implementation
