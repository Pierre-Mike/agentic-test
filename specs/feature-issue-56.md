# Feature: Add /test endpoint returning {test: "ok"}

## Feature Description
Add a simple GET endpoint at `/test` that returns a JSON response with `{"test": "ok"}`. This endpoint serves as a test endpoint for validating API functionality and automated workflow testing.

## User Story
As a developer or automated testing system
I want to call a simple `/test` endpoint
So that I can verify the API is responding correctly with a known, predictable response

## Problem Statement
There is currently no simple test endpoint available for quick health checks or automated workflow validation. While we have `/version` and `/hello` endpoints, we need a minimal test endpoint that returns a known, simple response structure.

## Solution Statement
Implement a new GET endpoint at `/test` that returns a simple JSON object `{"test": "ok"}` with a 200 status code and `application/json` content-type header. This will be type-safe using a shared TypeScript type definition and follow the existing patterns in the codebase.

## Relevant Files
Use these files to implement the feature:

- `server/src/index.ts` - Main server file where routes are defined. Add the new `/test` endpoint here following the existing pattern.
- `server/src/index.test.ts` - Test file for server endpoints. Add unit tests for the new endpoint here.
- `shared/src/types/index.ts` - Shared type definitions. Add the `TestResponse` type here.

### New Files
No new files need to be created.

## Implementation Plan

### Phase 1: Foundation
Define the shared type for the test response in the `shared` package to ensure type safety across client and server.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following existing patterns, using the shared type definition.

### Phase 3: Integration
Add comprehensive tests to validate the endpoint behavior and ensure it meets all acceptance criteria.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### 1. Define shared type
- Add `TestResponse` type to `shared/src/types/index.ts`
- Type should be: `{ test: string }`

### 2. Write unit tests
- Add test suite for `/test` endpoint in `server/src/index.test.ts`
- Test 1: should return status 200
- Test 2: should return JSON with correct structure `{test: "ok"}`
- Test 3: should have application/json content-type
- Test 4: should return exact value `{test: "ok"}`
- Follow the existing test pattern from `/version` endpoint tests

### 3. Implement the endpoint
- Add GET `/test` route in `server/src/index.ts`
- Import `TestResponse` type from shared
- Return JSON response with `{test: "ok"}` and status 200
- Follow the existing pattern used in `/hello` and `/version` endpoints

### 4. Run validation commands
- Execute all validation commands to ensure zero regressions
- All tests must pass
- Build must succeed without errors
- Type checking must pass

## Testing Strategy

### E2E Tests
Not required for this simple endpoint. The unit tests provide sufficient coverage.

### Unit Tests
- Test that GET `/test` returns status code 200
- Test that response body is exactly `{test: "ok"}`
- Test that content-type header is `application/json`
- Test that response structure matches `TestResponse` type

### Integration Tests
Not required. This is a simple standalone endpoint with no external dependencies.

### Edge Cases
- Verify endpoint only responds to GET requests
- Verify response is consistent across multiple calls
- Verify type safety is maintained

## Acceptance Criteria
- GET `/test` endpoint exists and is accessible
- Returns HTTP status code 200
- Response body is exactly `{test: "ok"}`
- Response content-type header is `application/json`
- Response uses the shared `TestResponse` type for type safety
- All unit tests pass
- No regressions in existing tests
- Build completes successfully
- Type checking passes

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all tests to validate the feature works with zero regressions
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces

## Notes
- This is a test endpoint for automated workflow validation
- The endpoint intentionally returns a simple, static response
- No database or external service dependencies
- Follow the existing patterns from `/version` and `/hello` endpoints for consistency
- The response type `TestResponse` follows the same naming convention as `ApiResponse` and `VersionResponse`
