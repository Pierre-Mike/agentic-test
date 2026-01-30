# Feature: Test API Endpoint

## Feature Description
Create a simple test API endpoint at `/test` that returns a JSON response with the structure `{test: "ok"}`. This endpoint serves as a basic health check or test endpoint for development and debugging purposes.

## User Story
As a developer
I want to call a `/test` API endpoint
So that I can quickly verify the server is responding correctly with a simple test response

## Problem Statement
Currently, there is no dedicated test endpoint that returns a simple, standardized response. While the `/version` endpoint exists, a more minimal test endpoint would be useful for quick health checks, testing API connectivity, and debugging during development.

## Solution Statement
Implement a new GET endpoint at `/test` that returns a JSON response with the structure `{test: "ok"}`. This endpoint will follow the existing patterns in the codebase by:
1. Defining a new TypeScript type in the shared package for type safety
2. Adding the endpoint to the Hono server with proper typing
3. Following the established pattern of using `c.json()` to return typed responses
4. Including comprehensive tests to ensure reliability

## Relevant Files
Use these files to implement the feature:

- `shared/src/types/index.ts` - Contains shared type definitions; will add `TestResponse` type here for type safety across client and server
- `server/src/index.ts` - Contains the Hono app and all route definitions; will add the new `/test` GET endpoint here following the existing pattern
- `server/src/index.test.ts` - Contains server unit tests; will add tests for the new endpoint to ensure it works correctly

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New e2e test file to validate the `/test` endpoint works correctly in an end-to-end scenario

## Implementation Plan
### Phase 1: Foundation
First, we need to establish the type definitions in the shared package to ensure type safety between client and server. This follows the established pattern where all API response types are defined in `shared/src/types/index.ts`.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the Hono server following the existing patterns. The endpoint will use the shared type and return a properly typed JSON response with status 200.

### Phase 3: Integration
The endpoint will integrate seamlessly with the existing Hono app structure. No changes to CORS or middleware are needed as they are already configured at the app level.

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse Type to Shared Package
- Add `TestResponse` type definition to `shared/src/types/index.ts`
- The type should have a single property `test` of type `"ok"` (literal type for strict type safety)
- Follow the existing pattern used by `ApiResponse` and `VersionResponse`

### Step 2: Write Unit Tests for /test Endpoint
- Add comprehensive unit tests to `server/src/index.test.ts`
- Test that the endpoint returns status 200
- Test that the response has the correct JSON structure with `{test: "ok"}`
- Test that the content-type header is `application/json`
- Test that the response matches the `TestResponse` type
- Follow the existing test patterns in the file using `describe` and `test` blocks

### Step 3: Write E2E Tests for /test Endpoint
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Test that the `/test` endpoint is accessible
- Test that it returns the expected JSON structure
- Test that the response can be parsed correctly
- Follow the existing Playwright patterns used in other e2e tests

### Step 4: Implement /test Endpoint
- Add the new GET endpoint to `server/src/index.ts`
- Import the `TestResponse` type from `shared/dist`
- Implement the endpoint using `.get("/test", ...)` pattern
- Return `c.json(data, { status: 200 })` with properly typed data
- Follow the existing code style and patterns

### Step 5: Run Validation Commands
- Execute all validation commands listed below to ensure zero regressions
- Fix any issues that arise during validation
- Ensure all tests pass and builds complete successfully

## Testing Strategy
### E2E Tests
- **Test endpoint accessibility**: Verify the `/test` endpoint can be accessed via HTTP GET request
- **Test response format**: Verify the endpoint returns valid JSON with the correct structure
- **Test response parsing**: Verify the response can be parsed and matches expected values
- **Test integration**: Verify the endpoint works correctly in the full stack environment

### Unit Tests
- **Test HTTP status code**: Verify endpoint returns 200 status code
- **Test response structure**: Verify the JSON response has the `test` property with value `"ok"`
- **Test response type**: Verify the response matches the `TestResponse` TypeScript type
- **Test content-type header**: Verify the response has the correct `application/json` content-type
- **Test type safety**: Verify TypeScript compilation with strict type checking

### Integration Tests
Integration testing is covered by the e2e tests which test the full stack including:
- Server endpoint implementation
- Type sharing between server and shared package
- HTTP request/response cycle
- JSON serialization/deserialization

### Edge Cases
- **Test malformed requests**: The endpoint should handle requests gracefully even with unexpected headers or query parameters
- **Test multiple requests**: Verify the endpoint can handle multiple concurrent requests
- **Test response consistency**: Verify the endpoint always returns the same response structure
- **Test with CORS**: Verify the endpoint respects CORS settings (inherited from app-level middleware)

## Acceptance Criteria
- [ ] A new `TestResponse` type is defined in `shared/src/types/index.ts`
- [ ] The `/test` GET endpoint exists in `server/src/index.ts`
- [ ] The endpoint returns JSON with structure `{test: "ok"}`
- [ ] The endpoint returns HTTP status 200
- [ ] The endpoint returns content-type `application/json`
- [ ] All unit tests pass for the new endpoint
- [ ] All e2e tests pass for the new endpoint
- [ ] All existing tests continue to pass (zero regressions)
- [ ] TypeScript compilation succeeds with no errors
- [ ] The implementation follows existing code patterns and conventions

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the feature works with zero regressions
- `bun run test:e2e` - Run all e2e tests to validate end-to-end functionality
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `bun run lint` - Lint all workspaces to ensure code quality
- `curl http://localhost:8787/test` - Manual test of the endpoint (requires server running)

## Notes
- This is a simple feature that follows well-established patterns in the codebase
- No new dependencies are required
- The endpoint is intentionally simple and stateless for easy testing
- The literal type `"ok"` for the `test` property provides stronger type safety than a generic `string` type
- Consider this endpoint as a foundation for more complex health check or status endpoints in the future
- The endpoint inherits CORS configuration from the app-level middleware, so it will work with cross-origin requests
