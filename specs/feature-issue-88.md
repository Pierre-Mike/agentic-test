# Feature: Add /test endpoint

## Feature Description
Add a simple GET endpoint `/test` to the Hono server that returns a JSON response with `{"test": "ok"}`. This endpoint serves as a test endpoint for validating the auto-implementation workflow and demonstrates the standard pattern for adding new JSON API endpoints to the bhvr server.

## User Story
As a developer testing the auto-implementation workflow
I want a simple test endpoint that returns a predictable JSON response
So that I can validate the workflow functions correctly end-to-end

## Problem Statement
The auto-implementation workflow needs a simple, well-defined test case to validate that it can successfully plan and implement new API endpoints. Currently, there is no dedicated test endpoint that exists solely for workflow validation purposes.

## Solution Statement
Create a new GET endpoint `/test` following the existing patterns established in the codebase (as seen in `/hello` and `/version` endpoints). The endpoint will return a simple JSON object `{"test": "ok"}` with a 200 status code and proper content-type headers. This implementation will include:
- A new TypeScript type `TestResponse` in the shared package for type safety
- The endpoint implementation in the server
- Comprehensive unit tests following the pattern from `/version` tests
- E2E tests to validate the endpoint works in the full application context

## Relevant Files
Use these files to implement the feature:

- `shared/src/types/index.ts` - Contains shared TypeScript type definitions. Need to add `TestResponse` type here to maintain type safety between client and server.
- `server/src/index.ts` - Main Hono server file where all routes are defined. Will add the new `/test` endpoint here following the pattern of existing endpoints.
- `server/src/index.test.ts` - Unit tests for server endpoints. Will add comprehensive tests for the `/test` endpoint following the `/version` endpoint test pattern.

### New Files
- `e2e/tests/test-endpoint.spec.ts` - New E2E test file to validate the `/test` endpoint works in the full application context.

## Implementation Plan
### Phase 1: Foundation
Add the shared TypeScript type definition for the test endpoint response. This ensures type safety across the monorepo and follows the established pattern of defining response types in the shared package.

### Phase 2: Core Implementation
Implement the `/test` endpoint in the server following the existing pattern used for `/hello` and `/version`. The endpoint will:
- Use the `.get()` method on the Hono app
- Return JSON using `c.json()`
- Include proper status code (200)
- Use the TypeScript type from shared package

### Phase 3: Integration
Validate that the endpoint integrates properly with the existing server setup, including CORS middleware, and works correctly in all deployment scenarios (local development, production).

## Step by Step Tasks
IMPORTANT: Execute every step in order, top to bottom.

### Step 1: Add TestResponse type to shared package
- Open `shared/src/types/index.ts`
- Add the `TestResponse` type definition: `export type TestResponse = { test: string; };`
- This establishes type safety for the endpoint response

### Step 2: Write unit tests for /test endpoint
- Open `server/src/index.test.ts`
- Add a new describe block for "/test endpoint"
- Write test: "should return status 200"
- Write test: "should return JSON with correct structure"
- Write test: "should return {test: 'ok'}"
- Write test: "should have application/json content-type"
- Follow the exact pattern from the "/version endpoint" tests

### Step 3: Write E2E test for /test endpoint
- Create new file `e2e/tests/test-endpoint.spec.ts`
- Import required Playwright test utilities
- Write test to make GET request to `/test` endpoint
- Validate response status is 200
- Validate response body is `{"test": "ok"}`
- Validate content-type header is application/json

### Step 4: Implement /test endpoint
- Open `server/src/index.ts`
- Import `TestResponse` type from shared package
- Add new `.get("/test", ...)` endpoint after the `/version` endpoint
- Use `c.json()` to return `{ test: "ok" }` with status 200
- Type the response data as `TestResponse`

### Step 5: Run validation commands
- Execute `bun run test` to ensure all unit tests pass with zero regressions
- Execute `bun run build` to ensure no compilation errors
- Execute `bun run type-check` to validate TypeScript types across the monorepo
- Manually test the endpoint using curl or HTTP client to verify runtime behavior

## Testing Strategy
### E2E Tests
- **Test file**: `e2e/tests/test-endpoint.spec.ts`
- **Full flow test**: Make HTTP GET request to `/test` endpoint and validate:
  - Response status code is 200
  - Response body exactly matches `{"test": "ok"}`
  - Response content-type header contains "application/json"
- This validates the complete request/response cycle through the Hono server

### Unit Tests
- **Test file**: `server/src/index.test.ts`
- **Endpoint behavior tests**:
  - Status code is 200
  - Response is valid JSON
  - Response structure matches TestResponse type
  - Response content is exactly `{"test": "ok"}`
  - Content-type header is "application/json"
- Follow the exact testing pattern used for `/version` endpoint

### Integration Tests
Integration testing is covered by the E2E tests which validate:
- CORS middleware doesn't interfere with the endpoint
- Endpoint works correctly with Hono's request/response handling
- TypeScript types are properly shared between client and server
- The endpoint is accessible and functional in the full application context

### Edge Cases
- **Invalid HTTP methods**: The endpoint only accepts GET requests (handled by Hono routing)
- **Trailing slashes**: Hono's default routing handles `/test` and `/test/` consistently
- **Case sensitivity**: Route is case-sensitive as per Hono defaults (`/test` not `/TEST`)
- **Content negotiation**: Always returns JSON regardless of Accept header (standard API behavior)

## Acceptance Criteria
- [ ] GET request to `/test` returns HTTP status 200
- [ ] Response body is exactly `{"test": "ok"}`
- [ ] Response content-type header is "application/json"
- [ ] `TestResponse` type is defined in shared package and exported
- [ ] Unit tests pass for the `/test` endpoint
- [ ] E2E tests pass for the `/test` endpoint
- [ ] All existing tests continue to pass (zero regressions)
- [ ] TypeScript compilation succeeds with no errors
- [ ] Type checking passes across all workspaces

## Validation Commands
Execute every command to validate the feature works correctly with zero regressions.

- `bun run test` - Run all unit tests to validate the endpoint works and no regressions introduced
- `bun run build` - Build all workspaces to ensure no compilation errors
- `bun run type-check` - Type check all workspaces to ensure type safety
- `curl http://localhost:8787/test` - Manual runtime test of the endpoint (requires dev server running)
- `bun run test:e2e` - Run E2E tests to validate full application flow

## Notes
- This is a test endpoint created specifically for validating the auto-implementation workflow
- The endpoint follows established patterns from `/hello` and `/version` endpoints
- No external dependencies required - uses existing Hono framework capabilities
- The simple response structure makes it ideal for workflow validation
- After workflow validation is complete, this endpoint and related code can be removed if not needed for production
